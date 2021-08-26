import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActmtkTextService } from '@common/services/dictionaries/actmtk-text.service';
import { ActmtkComissionSolutionService } from '@common/services/dictionaries/actmtk-comission-solution.service';
import { ActmtkComissionRecomendationService } from '@common/services/dictionaries/actmtk-comission-recomendation.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ActMtkService } from '@common/services/act-mtk.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { FormUtils } from '@common/utils/form';
import { ActMtk } from '@common/models/act-mtk';
import { Visit } from '@common/models/visit';
import { CommissionMember } from '@common/models/act-mtk-template';
import { StringCustomValidators } from '@common/validators/string-custom-valid';

@Component({
  selector: 'sl-create-mtk',
  templateUrl: './create-mtk.component.html',
  styleUrls: ['./create-mtk.component.less'],
  providers: [
    ActmtkTextService,
    ActmtkComissionSolutionService,
    ActmtkComissionRecomendationService,
    ActMtkService,
  ],
})
export class CreateMtkComponent implements OnInit {

  @Input()
  visit: Visit;
  @Input() data;
  public templates;
  public commisionSolutions = [];
  public commissionRecomendations = [];
  public selectedRecomendation;
  public selectedSolution;
  public isBusy = true;

  public form: FormGroup;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    public toastsService: ToastsService,
    public actmtkComissionSolutionService: ActmtkComissionSolutionService,
    public actmtkComissionRecomendationService: ActmtkComissionRecomendationService,
    public modalService: NzModalService,
    public actMtkService: ActMtkService,
  ) {
    this.form = fb.group({
      number: [null, [StringCustomValidators.required]],
      actDate: [null, [Validators.required]],
      comissionChairman: fb.group({
        fio: [null, StringCustomValidators.required],
        position: [null, StringCustomValidators.required],
      }),
      comissionMembers: fb.array([]),
      content: [null, [StringCustomValidators.required]],
      comissionSolution: [null, [StringCustomValidators.required]],
      comissionRecomendations: [null, [StringCustomValidators.required]],
      attachmentId: [null],
    });
  }

  ngOnInit() {
    const pageSize = 500;
    const request: any = [
      this.actMtkService.getTemplates(),
      this.actmtkComissionSolutionService.getList({}, { pageSize }),
      this.actmtkComissionRecomendationService.getList({}, { pageSize }),
    ];
    if (this.data) {
      request.push(this.actMtkService.getActmtk(this.data.id));
    }
    forkJoin(request)
      .subscribe(
        (response: any) => {
          this.templates = response[0];
          this.commisionSolutions = response[1].data;
          this.commissionRecomendations = response[2].data;
          const mtkData: ActMtk = response[3];
          if (mtkData) {
            this.initFormData(mtkData);
          }
        },
        error => this.onError(error),
        () => this.isBusy = false);
  }

  initFormData(mtkData: ActMtk) {
    const data = {
      number: mtkData.number,
      actDate: mtkData.actDate,
      content: mtkData.content,
      comissionSolution: mtkData.comissionSolution,
      comissionRecomendations: mtkData.comissionRecomendations,
      attachmentId: mtkData.attachmentId,
      ...mtkData.comissionChairman && {
        comissionChairman: mtkData.comissionChairman,
      },
    };
    this.form.patchValue(data);
    if (mtkData.comissionMembers) {
      (mtkData.comissionMembers || [] as CommissionMember[])
        .forEach((member) => {
          (<FormArray>this.form.controls.comissionMembers).push(this.fb.group({
            fio: [member.fio, Validators.required],
            position: [member.position, Validators.required],
          }));
        });
    }
  }

  onSelect(selectedValue, type: 'comissionRecomendations' | 'comissionSolution') {
    const control: FormControl = <FormControl>this.form.get(type);
    switch (type) {
      case 'comissionRecomendations':
        setTimeout(() => this.selectedRecomendation = null);
        break;
      case 'comissionSolution':
        setTimeout(() => this.selectedSolution = null);
        break;
    }

    this.modalService.confirm({
      nzOkText: 'Добавить',
      nzCancelText: 'Отмена',
      nzContent: `Вы действительно хотите добавить '${selectedValue.name}'?`,
      nzBodyStyle: {
        wordWrap: 'break-word',
      },
      nzOnOk: () => {
        const oldValue = control.value;
        control.setValue(`${oldValue ? (oldValue + '\r\n') : ''}${selectedValue.name}`);
      },
    });
  }

  closeForm() {
    this.modal.destroy();
  }

  public createAct() {
    FormUtils.markAsDirty(this.form);
    if (this.form.valid) {
      this.isBusy = true;
      const actMtk = new ActMtk({ ...this.form.value, visitId: this.visit.id });
      const request = this.data ?
        this.actMtkService.updateActmtk(this.data.id, actMtk)
        : this.actMtkService.createActmtk(actMtk);
      request
        .subscribe(
          (act) => {
            this.modal.destroy(act);
            this.toastsService.success(`Акт МТК № ${act.number} успешно ${this.data ? 'обновлен' : 'создан'}`, { nzDuration: 3000 });
          },
          error => this.onError(error),
        );
    }
  }

  private onError(response: HttpErrorResponse) {
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

}
