import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MediaFile, MediaFileType } from '@common/models/media-file';
import { Measurement } from '@common/interfaces/Measurement';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'sl-media-preview',
  templateUrl: './visit-media-preview.component.html',
  styleUrls: ['./visit-media-preview.component.less'],
})
export class VisitMediaPreviewComponent {

  @Input()
  media: MediaFile;
  @Input()
  attachments: MediaFile[];
  @Input()
  readonly = false;
  @Input()
  public changedMedias: MediaFile[];
  @Input()
  measurements: Measurement[];
  @Input()
  changedMeasurements: Measurement[];

  @Output()
  previewMedia = new EventEmitter();
  @Output()
  deleteMedia = new EventEmitter();
  @Output()
  selectMedia = new EventEmitter();

  public mediaType = MediaFileType;

  public get showPrevious(): boolean {
    const index = this.attachments.findIndex((item: MediaFile) => item === this.media);

    return index !== 0;
  }

  public get showNext(): boolean {
    const index = this.attachments.findIndex((item: MediaFile) => item === this.media);

    return index !== this.attachments.length - 1;
  }

  constructor(protected modalService: NzModalService, public cd: ChangeDetectorRef) {

  }

  public preview(media, event) {
    event.stopPropagation();
    this.previewMedia.next(media);
  }

  public delete(media, event) {
    event.stopPropagation();
    this.modalService.confirm({
      nzOkText: 'Удалить',
      nzCancelText: 'Отмена',
      nzContent: `Вы действительно хотите удалить файл '${this.media.fileName}'?`,
      nzBodyStyle: {
        wordWrap: 'break-word',
      },
      nzOnOk: () => this.deleteMedia.next(media),
    });
  }

  public select(media) {
    event.stopPropagation();
    this.selectMedia.next(media);
  }

  public previous(): void {
    const index = this.attachments.findIndex((item: MediaFile) => item === this.media);

    if (index === 0) {
      return;
    }

    this.media = this.attachments[index - 1];
    this.cd.markForCheck();
  }

  public next(): void {
    const index = this.attachments.findIndex((item: MediaFile) => item === this.media);

    if (index === this.attachments.length - 1) {
      return;
    }

    this.media = this.attachments[index + 1];
    this.cd.markForCheck();
  }
}
