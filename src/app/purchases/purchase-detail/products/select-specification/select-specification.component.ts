import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { SpecificationService } from '@common/services/specification.service';
import { Specification } from '@common/models/specification';
import { DictionarySpecificationComponent } from '../dictionary-specification/dictionary-specification.component';
import { StringCustomValidators } from '@common/validators/string-custom-valid';

@Component({
  templateUrl: './select-specification.component.html',
  styleUrls: ['./select-specification.component.less'],
})
export class SelectSpecificationComponent implements OnInit, AfterViewInit {
  @Input() formType: string;
  @Input() data: any;

  @ViewChild('codeInput')
  codeInput: ElementRef;

  form: FormGroup;
  specificationList: Specification[] = [];
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private specificationService: SpecificationService,
  ) {
    this.form = this.formBuilder.group({
      name: [null, StringCustomValidators.required],
      code: [null, StringCustomValidators.required],
      manufacturer: [null, StringCustomValidators.required],
      count: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      note: [null],
    } as { [key: string]: any });
  }

  ngOnInit() {
    if (this.formType === 'edit') {
      this.fillForm(this.data);
    }
  }

  ngAfterViewInit() {
    this.form.controls['code'].valueChanges
      .distinctUntilChanged()
      .subscribe(value => this.setCode(value));
  }

  fillForm(data) {
    const { name, code, manufacturer, count, price, note } = data;
    this.form.patchValue({ name, code, manufacturer, count, price, note } as any);
    // хак, разобраться почему не устанавливается значение в инпут 'code',
    // после this.form.patchValue (связано с nz-autocomplete)
    this.codeInput.nativeElement.value = code;
  }

  onSearch(value: string): void {
    if (!value || value && value.length < 3) {
      this.specificationList = null;
      return;
    }
    this.loading = true;
    this.getSpecificationList(value);
  }

  private getSpecificationList(value) {
    const params = { code: value };
    this.specificationService.getDictionary(params)
      .subscribe((data) => {
        this.loading = false;
        this.specificationList = data.data;
      });
  }

  private setCode(value) {
    if (!this.specificationList || this.specificationList.length === 0) {
      return;
    }
    let result = null;
    this.specificationList.some((item: Specification) => {
      if (item.code === value) {
        result = item;
        return true;
      }
    });
    if (result !== null) {
      this.fillForm(result);
    }
  }

  openSpecificationList() {

    const modalRef = this.modalService.create({
      nzTitle: 'Справочник спецификаций',
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: DictionarySpecificationComponent,
      nzFooter: null,
      nzWidth: '800px',
    });
    modalRef.afterClose
      .filter(value => value)
      .subscribe((value) => {
        if (value) {
          this.fillForm(value);
        }
      });
  }

  private getSpecificationModel() {
    const { name, code, manufacturer, count, price, note } = this.form.value;
    return {
      code,
      name,
      count,
      price,
      manufacturer,
      note,
      id: this.data && this.data.id ? this.data.id : null,
    };
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }
    const data = this.getSpecificationModel();
    this.closeForm(data);
  }

  closeForm(data?) {
    this.modal.destroy(data);
  }
}
