import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Measurement, MesurementType, ArcAngle, VertebraTorsion } from '@common/interfaces/Measurement';
import { XrayArcs } from '@modules/xray/xray-photo/xray-line-edit/xray-arcs';
import { FilesService } from '@common/services/file.service';
import { MediaFileType, MediaFile } from '@common/models/media-file';
import { XrayPhoto } from '@modules/xray/xray-photo/xray-photo.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EnumToArrayPipe } from '@common/pipes/enum-to-array';
import { ToastsService } from '@common/services/toasts.service';
import { VertebraTorsionService } from '@common/services/vertebra-torsion.service';
import { NzModalService } from 'ng-zorro-antd';
import { VisitsService } from '@common/services/visits';

export interface ArcAngle {
  value: number;
  type: MesurementType;
}
@Component({
  selector: 'sl-xray-line-edit',
  templateUrl: './xray-line-edit.component.html',
  styleUrls: ['./xray-line-edit.component.less'],
  providers: [VertebraTorsionService],
})
export class XrayLineEditComponent implements OnInit {
  public xrayArcs: XrayArcs;

  readonly measureCardBodyStyle = { height: '100%', padding: '0px 0px 16px 16px' };
  readonly canvasCardBodyStyle = { height: '100%', padding: '0px 0px 16px 0px' };

  public archAngle: ArcAngle;
  public imageId: number;
  public fileLoading = false;
  public form: FormGroup;
  public savedPhotoId;

  private _changedMeasurements: Measurement[];
  private _scale: number;

  @Input()
  public imageURI: string;
  @Input()
  public imageName: string;
  @Input()
  public visitId: string;
  @Input()
  public measurements: Measurement[];
  @Output()
  public changeArcs = new EventEmitter();
  @Output()
  public save = new EventEmitter<XrayPhoto>();

  public arcAngle: ArcAngle;
  public get types(): string[] {
    return new EnumToArrayPipe().transform(MesurementType);
  }

  public set containerScale(scale) {
    this.xrayArcs.zoom(scale / 100);
    this._scale = scale;
  }
  public get containerScale() {
    return this._scale;
  }

  constructor(
    private filesService: FilesService,
    private fb: FormBuilder,
    private messageService: ToastsService,
    private vertebraTorsionService: VertebraTorsionService,
    private visitsService: VisitsService) {
    this.xrayArcs = new XrayArcs();
    this.form = fb.group({
      measurements: [null]});
  }

  ngOnInit() {
    this._changedMeasurements = this.measurements.slice();
    this.form.patchValue({ measurements: { measurements: this._changedMeasurements } });
  }

  saveAsImage() {
    this.xrayArcs.clearSelection();
    this.visitsService.updateMeasurements(this.visitId, this._changedMeasurements)
        .switchMap(() =>  this.xrayArcs.getAsJpgImage())
        .switchMap(data => this.filesService.urlToFile(data, `${this.imageName}_measurements_arcs.jpeg`, 'image/jpeg'))
        .switchMap((file) => {
          this.fileLoading = true;
          return this.filesService.createTempMedia(file, MediaFileType.PHOTO);
        })
        .switchMap((tempFile: MediaFile) => {
          return this.visitsService.createPhoto(this.visitId, tempFile);
        })
        .subscribe((response: MediaFile) => {
          if (this.savedPhotoId) {
            this.visitsService.deletePhoto(this.savedPhotoId)
                .subscribe(() => {
                  this.savedPhotoId = response.id;
                  this.fileLoading = false;
                });
          } else {
            this.savedPhotoId = response.id;
            this.fileLoading = false;
          }
          this.save.emit({ file: response, measurements: this._changedMeasurements });
        },
        () => {
          this.messageService.error('При сохранении фото произошла ошибка');
          this.fileLoading = false;
        });
  }

  changeArc() {
    this.changeArcs.emit(true);
  }

  measurementChangeHandler(measurements: Measurement[]) {
    this._changedMeasurements = measurements;
  }

  reset() {
    const clearMeasurements = [0, 1, 2, 3].map(index =>
      ({ id: this.measurements[index].id, type: this.measurements[index].type, boundary1: null, boundary2: null,
        vertex: null, value: null, rotation: null }));
    this.measurements = clearMeasurements;
    this.form.patchValue({ measurements: { measurements: clearMeasurements } });
    this.form.reset();
  }

  measureArcAngle(measureIndex: number) {
    const angleType = MesurementType[this.types[measureIndex]];
    this.xrayArcs
    .getAngle(angleType)
    .subscribe((angle: number) => {
      if (measureIndex !== undefined) {
        this._changedMeasurements[measureIndex].value = Math.round(angle);
        this.form.get('measurements').patchValue({ measurements: this._changedMeasurements });
      }
      this.xrayArcs.clearSelection();
    }, (error) => {
      this.messageService.error(error, { nzDuration: 3000 });
    });
  }

  measureVertebraTorsian(measureIndex: number) {
    this.xrayArcs
        .getTorsion()
        .switchMap((torsion: VertebraTorsion) => this.vertebraTorsionService.getTorsionCoefficient(torsion))
        .subscribe((torsionCoefficient) => {
          this._changedMeasurements[measureIndex].rotation = torsionCoefficient;
          this.form.get('measurements').patchValue({ measurements: this._changedMeasurements });
        },
        error => this.messageService.error(error, { nzDuration: 3000 }),
        );
  }

  removeAngle(angle: ArcAngle) {
    const changedMeasure = this._changedMeasurements.find(
      value => (parseInt(value.type, 10) === (this.types.indexOf(angle.type) + 1)) && (value.value === angle.value));
    if (changedMeasure) {
      changedMeasure.value = null;
      changedMeasure.rotation = null;
      this.form.get('measurements').patchValue({ measurements: this._changedMeasurements });
    }
  }
}
