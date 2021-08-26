import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { XrayPhoto } from '@modules/xray/xray-photo/xray-photo.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { VisitMediaPreviewComponent } from '@modules/patients/patient/patient-visits/visit-photo-video/visit-media-preview/visit-media-preview.component';
import { ToastsService } from '@common/services/toasts.service';

@Component({
  selector: 'sl-visit-photo-preview',
  templateUrl: './visit-photo-preview.component.html',
  styleUrls: ['./visit-photo-preview.component.less'],
})
export class VisitPhotoPreviewComponent extends VisitMediaPreviewComponent implements OnInit {

  public xrayVisible = false;
  public visitid: string;

  private _isXrayChanged = false;

  constructor(
    modalService: NzModalService,
    private modal: NzModalRef,
    public cd: ChangeDetectorRef,
    private toastService: ToastsService) {
    super(modalService, cd);
  }

  ngOnInit() {}

  showXray() {
    this.xrayVisible = true;
  }

  public goToLink(url: string) {
    window.open(url, '_blank');
  }

  saveXray(file: XrayPhoto) {
    if (file !== undefined) {
      this.changedMedias.splice(0, 1, file.file);
      this.changedMeasurements.push(...file.measurements);
      this._isXrayChanged = false;
      // this.modal.destroy();
      this.toastService.success('Изображение успешно сохранено');
    }
  }

  close() {
    if (this._isXrayChanged) {
      this.modalService.warning({
        nzTitle: 'Все несохраненные изменения будут удалены, продолжить?',
        nzOkText: 'Да',
        nzCancelText: 'Нет',
        nzOnOk: () => {
          this.modal.destroy();
        },
      });
    } else {
      this.modal.destroy();
    }
  }

  updateXrayChanged(isChanged: boolean) {
    this._isXrayChanged = isChanged;
  }
}
