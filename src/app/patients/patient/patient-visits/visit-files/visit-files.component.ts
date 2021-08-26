import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { FilesService } from '@common/services/file.service';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisitsService } from '@common/services/visits';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';

@Component({
  selector: 'sl-visit-files',
  templateUrl: './visit-files.component.html',
  styleUrls: ['./visit-files.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VisitFilesComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VisitFilesComponent {
  @Input()
  visitsManager: VisitsManager;

  public fileList: UploadFile[] = [];
  public fileLoading = false;
  public isDisabled = false;
  public visitFiles = [];
  public onChange = value => void 0;
  public onTouched = () => void 0;

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled) {
    return this.isDisabled = isDisabled;
  }

  public writeValue(value = []) {
    this.visitFiles = value;
    this.cdr.markForCheck();
  }

  constructor(
    private filesService: FilesService,
    private cdr: ChangeDetectorRef,
    private modalService: NzModalService,
    private visitService: VisitsService,
  ) {
  }

  deleteFile(file) {
    this.modalService.confirm({
      nzOkText: 'Удалить',
      nzCancelText: 'Отмена',
      nzContent: `Вы действительно хотите удалить файл '${file.fileName}'?`,
      nzBodyStyle: {
        wordWrap: 'break-word',
      },
      nzOnOk: () => {
        const index = this.visitFiles.findIndex(_file => _file === file);
        if (index >= 0) {
          this.visitService.deleteFile(file.id)
              .subscribe(() => {
                this.visitFiles.splice(index, 1);
                this.visitsManager.updateOthersFiles(this.visitFiles);
                this.cdr.markForCheck();
              });
        }
      },
    });
  }

  onFileChosen = (file: UploadFile) => {
    if (!file) {
      return;
    }
    this.toggleBusyState();
    this.filesService.createTemp(file)
        .switchMap(tmpFile => this.visitService.createFile(this.visitsManager.selected.id, tmpFile))
        .subscribe(
        (response) => {
          this.visitFiles.push(response);
          this.visitsManager.updateOthersFiles(this.visitFiles);
        },
        () => {
          this.fileLoading = false;
          this.cdr.markForCheck();
        },
        () => this.toggleBusyState(),
      );
    return false;
  }

  private toggleBusyState() {
    this.fileLoading = !this.fileLoading;
    this.cdr.markForCheck();
  }

}
