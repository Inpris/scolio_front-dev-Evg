import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MediaFile } from '@common/models/media-file';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'sl-visit-photo-compare',
  templateUrl: './visit-photo-compare.component.html',
  styleUrls: ['./visit-photo-compare.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitPhotoCompareComponent implements OnInit {

  @Input()
  photos: MediaFile[];

  public maxWidth: string;

  constructor(private modal: NzModalRef) {}

  ngOnInit() {
    this.maxWidth = `${Math.ceil(100 / this.photos.length)}%`;
  }

  close() { this.modal.close(); }

}
