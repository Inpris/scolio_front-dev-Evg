import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MediaFile, MediaFileType } from '@common/models/media-file';
import { FilesService } from '@common/services/file.service';
import { Measurement } from '@common/interfaces/Measurement';
import { NzModalService } from 'ng-zorro-antd';

export interface XrayPhoto {
  file: MediaFile;
  measurements: Measurement[];
}

@Component({
  selector: 'sl-xray-photo',
  templateUrl: './xray-photo.component.html',
  styleUrls: ['./xray-photo.component.less'],
})

export class XrayPhotoComponent implements OnDestroy, OnInit {
  @Input()
  public imageId: string = '';

  @Input()
  media: MediaFile;
  @Input()
  measurements: Measurement[];
  @Input()
  visitId: string;

  @Output()
  saveXray = new EventEmitter<XrayPhoto>();
  @Output()
  updateXrayChanged = new EventEmitter<boolean>();

  public imageURI: string;
  public imageName: string;
  public isTemp: boolean;
  public isPhotoChanged = false;
  public isArcsChanged = false;
  public savedPhoto: MediaFile;

  public fileLoading = false;
  private _defaultShouldReuseRoute;

  public isShowPhotoMode = true;

  constructor(private filesService: FilesService,
              private router: Router,
              private modalService: NzModalService) {
    this._defaultShouldReuseRoute = this.router.routeReuseStrategy.shouldReuseRoute;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    if (this.media !== undefined) {
      this.imageURI = this.media.contentURI;
      this.imageName = this.media.fileName.replace(/\.[^/.]+$/, '');
    }
  }

  ngOnDestroy() {
    this.router.routeReuseStrategy.shouldReuseRoute = this._defaultShouldReuseRoute;
  }

  editPhoto() {
    if (this.isArcsChanged) {
      this.modalService.warning({
        nzTitle: 'Все несохраненные изменения будут удалены, продолжить?',
        nzOkText: 'Да',
        nzCancelText: 'Нет',
        nzOnOk: () => {
          this.isShowPhotoMode = true;
          this.isArcsChanged = false;
        },
      });
    } else {
      this.isShowPhotoMode = true;
    }
  }

  editLines() {
    if (this.isPhotoChanged) {
      this.modalService.warning({
        nzTitle: 'Все несохраненные изменения будут удалены, продолжить?',
        nzOkText: 'Да',
        nzCancelText: 'Нет',
        nzOnOk: () => {
          this.isShowPhotoMode = false;
          this.isPhotoChanged = false;
        },
      });
    } else {
      this.isShowPhotoMode = false;
    }
  }

  saveXrayFile(xrayPhoto: XrayPhoto) {
    this.saveXray.emit(xrayPhoto);
    this.savedPhoto = xrayPhoto.file;
    this.isPhotoChanged = false;
    this.isArcsChanged = false;
    this.updateXrayChanged.emit(false);
  }

  savePhoto(photo: MediaFile) {
    this.saveXrayFile({ file: photo, measurements: this.measurements });
  }

  updatePhoto(photo: MediaFile) {
    this.imageId = photo.content.tempAttachmentId;
    this.imageURI = photo.contentURI;
    this.isPhotoChanged = false;
    this.updateXrayChanged.emit(true);
  }

  setPhotoChanged(isChanged: boolean) {
    this.isPhotoChanged = isChanged;
    this.updateXrayChanged.emit(isChanged);
  }

  setArcsChanged(isChanged: boolean) {
    this.isArcsChanged = isChanged;
    this.updateXrayChanged.emit(isChanged);
  }
}
