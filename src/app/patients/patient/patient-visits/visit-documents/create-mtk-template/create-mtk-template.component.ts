import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { ActMtkService } from '@common/services/act-mtk.service';
import { FormUtils } from '@common/utils/form';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { StringCustomValidators } from '@common/validators/string-custom-valid';

@Component({
  selector: 'sl-create-mtk-template',
  templateUrl: './create-mtk-template.component.html',
  styleUrls: ['./create-mtk-template.component.less'],
  providers: [ActMtkService],
})
export class CreateMtkTemplateComponent implements OnInit {

  public selectedTemplate;
  public isBusy = true;
  public form: FormGroup;
  public templates;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private actMtkService: ActMtkService,
    private toastsService: ToastsService,
  ) {
    this.form = fb.group({
      name: [null, StringCustomValidators.required],
      comissionChairman: fb.group({
        fio: [null, StringCustomValidators.required],
        position: [null, StringCustomValidators.required],
      }),
      comissionMembers: fb.array([]),
      content: [null, [StringCustomValidators.required]],
    });
  }

  ngOnInit() {
    this.actMtkService.getTemplates()
      .subscribe(
        (templates) => {
          this.templates = templates;
        },
        error => this.onError(error),
        () => this.isBusy = false,
      );
  }

  saveTemplate() {
    FormUtils.markAsDirty(this.form);
    if (this.form.valid) {
      this.isBusy = true;
      this.actMtkService.createTemplate({ ...this.form.value, id: this.selectedTemplate.id })
        .subscribe(
          (response) => {
            this.toastsService.success(`Шаблон успешно ${this.selectedTemplate.id ? 'обновлен' : 'создан' }`, { nzDuration: 3000 });
            if (this.selectedTemplate.id) {
              Object.assign(
                this.templates.find(template => template.id === this.selectedTemplate.id),
                response,
              );
            } else {
              this.templates.push(response);
              this.selectedTemplate = response;
            }
          },
          error => this.onError(error),
          () => this.isBusy = false,
        );
    }
  }

  closeForm() {
    this.modal.destroy();
  }

  private onError(response: HttpErrorResponse) {
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

}
