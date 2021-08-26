import { Component, forwardRef, Input, EventEmitter, Type } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { VisitPhotoPreviewComponent } from './visit-photo-preview/visit-photo-preview.component';
import { FilesService } from '@common/services/file.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MediaFile, MediaFileType } from '@common/models/media-file';
import { VisitVideoPreviewComponent } from '@modules/patients/patient/patient-visits/visit-photo-video/visit-video-preview/visit-video-preview.component';
import { VisitMediaPreviewComponent } from '@modules/patients/patient/patient-visits/visit-photo-video/visit-media-preview/visit-media-preview.component';
import { Measurement } from '@common/interfaces/Measurement';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { VisitsService } from '@common/services/visits';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'sl-visit-photo-video',
  templateUrl: './visit-photo-video.component.html',
  styleUrls: ['./visit-photo-video.component.less'],
  providers: [FilesService, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VisitPhotoVideoComponent),
    multi: true,
  }],
})
export class VisitPhotoVideoComponent implements ControlValueAccessor {

  @Input()
  readonly = false;
  @Input()
  public attachments: MediaFile[] = [];
  @Input()
  public measurementsControl: FormControl;
  @Input()
  visitsManager: VisitsManager;
  public fileLoading = false;
  public extensions = MediaFile.getAllowedTypes();
  public changeFileEmmitter = new EventEmitter<MediaFile>();
  public changedMedias: MediaFile[] = [];
  public changedMeasurements: Measurement[] = [];
  private _measurements: Measurement[];
  public onTouched = () => void 0;
  public onChange = value => void 0;

  constructor(
    private modal: NzModalService,
    private filesService: FilesService,
    private messageService: NzMessageService,
    private visitsService: VisitsService,
  ) {
    this.changeFileEmmitter.subscribe(() => {
      if (this.changedMedias.length > 0) {
        this.attachments = [...this.attachments, this.changedMedias[0]];
        this.visitsManager.updateAttachments(this.photos, this.videos);
        this.changedMedias = [];
      }
      if (this.changedMeasurements.length > 0) {
        this.measurementsControl.patchValue({ measurements: this.changedMeasurements });
        this.changedMeasurements = [];
        this.visitsManager.updateMeasurements(this.changedMeasurements);
      }
    });
  }

  previewMedia(media: MediaFile) {
    this._measurements = this.measurementsControl && this.measurementsControl.value.measurements;
    const isPhoto = media.type === MediaFileType.PHOTO;
    const visitId = (this.visitsManager && this.visitsManager.selected) ? this.visitsManager.selected.id : null;
    const componentToPreview:  Type<VisitMediaPreviewComponent> = isPhoto
      ? VisitPhotoPreviewComponent
      : VisitVideoPreviewComponent;

    this.modal.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: componentToPreview,
      nzFooter: null,
      nzComponentParams: {
        media,
        visitId,
        attachments: this.attachments,
        readonly: this.readonly,
        changedMedias: this.changedMedias,
        measurements: this._measurements,
        changedMeasurements: this.changedMeasurements,
      },
      ...isPhoto && {
        nzWidth: '100%',
        nzBodyStyle: {
          background: 'none',
          height: '100vh',
          width: '100vw',
          'padding-bottom': '0px',
        },
      },
      nzStyle: isPhoto
        ? {
          top: '0',
          padding: '0',
          height: '100%',
        } : {
          width: '100%',
          display: 'flex',
          'justify-content': 'center',
        },
      nzAfterClose: this.changeFileEmmitter,
    });
  }

  deleteMedia(media: MediaFile) {
    const index = this.attachments.findIndex(_media => _media === media);
    this.visitsManager.removePhotosSelection([this.attachments[index]]);
    this.attachments = [...this.attachments.slice(0, index), ...this.attachments.slice(index + 1)];
    switch (true) {
      case media.type === MediaFileType.PHOTO:
        this.visitsService.deletePhoto(media.id).subscribe(() => {}); break;
      case media.type === MediaFileType.VIDEO:
        this.visitsService.deleteVideo(media.id).subscribe(() => {}); break;
      default: break;
    }
  }

  onFileChosen(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    const type = MediaFile.getType(file.type);
    if (type === MediaFileType.UNKNOWN) {
      return this.messageService.warning('Выбран неподдерживаемый формат файла');
    }
    this.fileLoading = true;
    const visitId = (this.visitsManager && this.visitsManager.selected) ? this.visitsManager.selected.id : null;
    this.filesService.createTempMedia(file, type)
        .switchMap((tempFile: MediaFile) => {
          switch (true) {
            case type === MediaFileType.PHOTO:
              return this.visitsService.createPhoto(visitId, tempFile);
            case type === MediaFileType.VIDEO:
              return this.visitsService.createVideo(visitId, tempFile);
            default: throw Observable.throw({});
          }
        })
      .subscribe(
        (response) => {
          this.attachments = [...this.attachments, response];
          this.visitsManager.updateAttachments(this.photos, this.videos);
          this.fileLoading = false;
        },
        () => {
          this.fileLoading = false;
        });
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(attachments) {
    if (!attachments) {
      this.attachments = [];
      return;
    }
    this.attachments = [...attachments];
  }

  get photos() {
    return this.attachments.filter(value => value.type === MediaFileType.PHOTO);
  }

  get videos() {
    return this.attachments.filter(value => value.type === MediaFileType.VIDEO);
  }

}
