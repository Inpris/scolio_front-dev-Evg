import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { CreateMtkComponent } from '@modules/patients/patient/patient-visits/visit-documents/create-mtk/create-mtk.component';
import { ActMtk } from '@common/models/act-mtk';
import { ActMtkService } from '@common/services/act-mtk.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';

@Component({
  selector: 'sl-visit-documents',
  templateUrl: './visit-documents.component.html',
  styleUrls: ['./visit-documents.component.less'],
  providers: [
    ActMtkService,
  ],
})
export class VisitDocumentsComponent {

  @Input()
  visitsManager: VisitsManager;

  public isBusy = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private actMtkService: ActMtkService,
    private toastsService: ToastsService,
  ) {
  }

  createMtk() {
    this.createMtkUpdateDialog()
      .afterClose
      .filter(value => value)
      .subscribe((act) => {
        this.visitsManager.selected.actsMtk.push(act);
      });
  }

  private createMtkUpdateDialog(data?) {
    return this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: CreateMtkComponent,
      nzComponentParams: {
        data,
        visit: this.visitsManager.selected,
      },
      nzFooter: null,
      nzWidth: '1024px',
      nzStyle: {
        top: '24px',
      },
    });
  }

  private findActIndex = act => this.visitsManager.selected.actsMtk.findIndex(_act => _act === act);

  public deleteAct(act: ActMtk) {
    this.modalService.confirm({
      nzOkText: 'Удалить',
      nzCancelText: 'Отмена',
      nzContent: `Вы действительно хотите удалить акт №'${act.number}'?`,
      nzBodyStyle: {
        wordWrap: 'break-word',
      },
      nzOnOk: () => {
        this.isBusy = true;
        this.actMtkService.deleteActmtk(act.id)
          .subscribe(
            () => {
              const index = this.findActIndex(act);
              if (index >= 0) {
                this.visitsManager.selected.actsMtk.splice(index, 1);
                this.isBusy = false;
              }
              this.toastsService.success(`Акт МТК № ${act.number} успешно удален`, { nzDuration: 3000 });
            },
            error => this.onError(error),
          );
      },
    });
  }

  public editAct(data) {
    this.createMtkUpdateDialog(data)
      .afterClose
      .filter(value => value)
      .subscribe((act) => {
        const index = this.findActIndex(data);
        if (index >= 0) {
          Object.assign(this.visitsManager.selected.actsMtk[index], act);
        }
      });
  }

  private onError(response: HttpErrorResponse) {
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

}
