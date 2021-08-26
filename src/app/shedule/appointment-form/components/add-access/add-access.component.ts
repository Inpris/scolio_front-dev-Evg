import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef, UploadFile} from "ng-zorro-antd";
import {Subject} from "rxjs";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {switchMap, takeUntil, tap} from "rxjs/operators";

import {Contact} from "@common/services/contacts";
import {FilesService} from "@common/services/file.service";
import {ToastsService} from "@common/services/toasts.service";
import {confirmAccessValidator} from "@modules/shedule/appointment-form/components/add-access/validator";
import {AccessesService} from "@common/services/accesses-service.service";

@Component({
  selector: 'sl-add-access',
  templateUrl: './add-access.component.html',
  styleUrls: ['./add-access.component.less']
})
export class AddAccessComponent implements OnInit, OnDestroy {
  @Input() public branchId: string;
  @Input() public contact: Contact;

  public isLoading = false;
  public form: FormGroup;
  public fileList = [];
  private searchText$ = new Subject();
  private showError: boolean;
  private isKilled$ = new Subject();

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private filesService: FilesService,
    private toastService: ToastsService,
    private message: NzMessageService,
    private accessesService: AccessesService,
  ) {}

  public closeModal() {
    this.modal.close();
  }

  public onSearch(lastName: string) {
    this.searchText$.next(lastName);
  }

  public submit(event) {
    event.preventDefault();

    if (this.form.invalid) {
      this.showError = true;
      this.message.error('Для подтверждения доступа необходимо заполнить все поля', { nzDuration: 3000 });
      return;
    }

    const request = {
      contactId: this.contact.id,
      branchId: this.branchId,
      numCode: +this.form.get('codeValue').value,
      consentProcess: this.form.get('linkToFile').value,
    };

    this.accessesService.updateAccess(request)
      .subscribe((response: any) => {
        this.message.info(response.message, { nzDuration: 3000 });
        this.closeModal();
      }, (err) => {
        this.message.error(err.error.errors[0], { nzDuration: 3000 });
      });
  }

  public checkValid(name: string) {
    const control: AbstractControl = this.form.get(name);

    return control.invalid && (control.dirty || this.showError);
  }

  fileChosen = (file: UploadFile) => {
    if (!file) {
      return;
    }

    this.filesService.createTemp(file)
      .pipe(
        switchMap((tempData) => this.filesService.create([tempData.tempAttachmentId]))
      )
      .subscribe(
        (data: any) => {
          this.form.get('linkToFile').setValue(data[0].id);
          this.message.info(`Файл ${data[0].fileName} был успешно загружен`, { nzDuration: 3000 });
        },
        (err) => {
          this.message.error(err, { nzDuration: 3000 });
        }
      )
  };

  ngOnInit() {
    this.form = this.fb.group({
      codeValue: this.fb.control('', Validators.required),
      linkToFile: this.fb.control('', Validators.required)
    }, { validators: confirmAccessValidator });

    this.form.valueChanges
      .pipe(
        takeUntil(this.isKilled$)
      )
      .subscribe(_ => {
        this.showError = false;
      });
  }

  ngOnDestroy(): void {
    this.isKilled$.next();
    this.isKilled$.complete();
  }
}
