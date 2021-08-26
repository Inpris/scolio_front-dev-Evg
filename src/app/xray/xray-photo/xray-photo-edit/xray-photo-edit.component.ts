import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { XrayPhoto } from '../xray-photo-edit/xray-photo';
import { FilesService } from '@common/services/file.service';
import { MediaFileType, MediaFile } from '@common/models/media-file';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs/Subject';
import { VisitsService } from '@common/services/visits';

@Component({
  selector: 'sl-xray-photo-edit',
  templateUrl: './xray-photo-edit.component.html',
  styleUrls: ['./xray-photo-edit.component.less'],
})
export class XrayPhotoEditComponent implements AfterViewInit  {

  private _xrayPhoto: XrayPhoto;
  public savedPhotoId;
  public canvasWidth;
  public canvasHeight;
  readonly defaulScale = 100;
  readonly buttonCardBodyStyle = { height: '100%', padding: '16px' };
  readonly canvasCardBodyStyle = { height: '100%', padding: '0px 0px 16px 0px' };

  public angle;

  public arc1Angle: number = 0;
  public arc2Angle: number = 0;

  public imageId: string;
  public set containerScale(scale) {
    if (!this.fileSaving) {
      this._xrayPhoto.zoom(scale / 100);
    }
    this._scale = scale;
  }
  public get containerScale() {
    return this._scale;
  }

  public cropping = false;
  public fileLoading = false;
  public fileSaving = false;
  public changesApplying = false;

  private _imageURI: string;
  private _scale;

  @Input()
  public set imageURI(data) {
    this._imageURI = data;
    if ((data !== undefined) && (this._xrayPhoto !== undefined)) {
      this._xrayPhoto.show(this._imageURI);
    }
  }
  @Input()
  public imageName: string;
  @Input()
  public visitId: string;
  @Output()
  public changePhoto = new EventEmitter();
  @Output()
  public loadPhoto = new EventEmitter<MediaFile>();
  @Output()
  public savePhoto = new EventEmitter<MediaFile>();
  @Output()
  public resetPhoto = new EventEmitter();
  @Output()
  public applyPhotoChanges = new EventEmitter<MediaFile>();

  @ViewChild('container') containerRef: ElementRef;
  @ViewChild('photoCanvas') canvasRef: ElementRef;
  @ViewChild('saveCanvas') saveCanvasRef: ElementRef;
  @ViewChild('lineSvg') svgRef: ElementRef;

  constructor(private filesService: FilesService,
              private modalService: NzModalService,
              private visitsService: VisitsService) {}

  ngAfterViewInit() {
    this.canvasWidth = this.containerRef.nativeElement.clientWidth;
    this.canvasHeight = this.containerRef.nativeElement.clientHeight;
    this._xrayPhoto =
    new XrayPhoto(this.containerRef.nativeElement,
                  this.canvasRef.nativeElement,
                  this.saveCanvasRef.nativeElement,
                  this.svgRef.nativeElement,
                  this.canvasWidth,
                  this.canvasHeight,
                  (this.changeZoom).bind(this));
    if (this._imageURI !== undefined) {
      this._xrayPhoto.show(this._imageURI);
    }
  }

  startCrop() {
    this.cropping = true;
    this._xrayPhoto.startCrop();
  }

  stopCrop() {
    this.cropping = false;
    this._xrayPhoto.stopCrop();
    this.changePhoto.emit();
  }

  cancelCrop() {
    this.cropping = false;
    this._xrayPhoto.cancelCrop();
  }

  rotate90Clockwise() {
    this._xrayPhoto.rotate90Clockwise();
    this.changePhoto.emit();
  }

  rotate90counterclockwise() {
    this._xrayPhoto.rotate90counterclockwise();
    this.changePhoto.emit();
  }

  rotate180() {
    this._xrayPhoto.rotate180();
    this.changePhoto.emit();
  }

  flipHorizontally() {
    this._xrayPhoto.flipHorizontally();
  }

  flipVertically() {
    this._xrayPhoto.flipVertically();
  }

  public onFileChosen(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const fr = new FileReader();
    fr.onload = function () {
      const type = MediaFile.getType(file.type);
      if (type === MediaFileType.UNKNOWN) {
        return null;
      }
      this.fileLoading = true;
      this.filesService.createTempMedia(file, type)
          .subscribe(
            (response: MediaFile) => {
              this.loadPhoto.emit(response);
              this.fileLoading = false;
            },
            () => {
              this.fileLoading = false;
            });
    }.bind(this);
    fr.readAsDataURL(file);
  }

  public getAsJpgImage() {
    const image = new Subject<File>();
    const dataURL = this._xrayPhoto.getAsJpgImage();
    this.filesService.urlToFile(dataURL, `${this.imageName}_measurements.jpeg`, 'image/jpeg')
        .subscribe(file => image.next(file));
    return image;
  }

  public applyChanges() {
    this.getAsJpgImage()
        .switchMap((file: File) => {
          this.changesApplying = true;
          this.containerScale = this.defaulScale;
          return this.filesService.createTempMedia(file, MediaFileType.PHOTO);
        })
        .subscribe((response: MediaFile) => {
          this.applyPhotoChanges.emit(response);
          this.changesApplying = false;
        },
          () => {
            this.changesApplying = false;
          });
  }

  public saveImage() {
    this.getAsJpgImage()
        .switchMap((file: File) => {
          this.changesApplying = true;
          this.containerScale = this.defaulScale;
          return this.filesService.createTempMedia(file, MediaFileType.PHOTO);
        }).switchMap((tempFile: MediaFile) => {
          return this.visitsService.createPhoto(this.visitId, tempFile);
        })
        .subscribe((response: MediaFile) => {
          if (this.savedPhotoId) {
            this.visitsService.deletePhoto(this.savedPhotoId)
                .subscribe(() => {
                  this.savedPhotoId = response.id;
                  this.changesApplying = false;
                });
          } else {
            this.savedPhotoId = response.id;
            this.changesApplying = false;
          }
          this.savePhoto.emit(response);
        },
          () => {
            this.changesApplying = false;
          });
  }

  public reset() {
    this.containerScale = this.defaulScale;
    this._xrayPhoto.reset();
    this.resetPhoto.emit();
  }

  public changeZoom(scale: number) {
    this.containerScale = Math.round(scale * 100);
  }
}
