import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { NzButtonComponent, NzModalService } from 'ng-zorro-antd';
import { XrayArcs } from '@modules/xray/xray-photo/xray-line-edit/xray-arcs';
import { ArcAngle } from '@common/interfaces/Measurement';
import { ToastsService } from '@common/services/toasts.service';

@Component({
  selector: 'sl-xray-arc-canvas',
  templateUrl: './xray-arc-canvas.component.html',
  styleUrls: ['./xray-arc-canvas.component.less'],
})
export class XrayArcCanvasComponent implements OnInit {

  @Input('xrayArcs') xrayArcs: XrayArcs;
  public editLineMode = false;
  public selectLineMode = false;
  public strikeLineMode = false;
  private _imageURI: string;
  private _isInit = false;

  public canvasWidth = 820;
  public canvasHeight = 460;

  @Input('imageURI')
  public set imageURI(data) {
    this._imageURI = data;
    if ((data !== undefined) && (this.xrayArcs !== undefined) && (this.isInit)) {
      this.xrayArcs.show(this._imageURI);
    }
  }

  @ViewChild('photoCanvas') canvasRef: ElementRef;
  @ViewChild('lineSvg') svgRef: ElementRef;
  @ViewChild('startDrawLineButton') startDrawLineButton: NzButtonComponent;
  @ViewChild('container') containerRef: ElementRef;

  @Output() selectArcAngle = new EventEmitter<ArcAngle>();
  @Output() changeArc = new EventEmitter();
  @Output() removeAngle = new EventEmitter<ArcAngle>();

  get isInit() {
    return this._isInit;
  }

  constructor(
    private messageService: ToastsService,
    private modalService: NzModalService) { }

  ngOnInit() {
    if (this.xrayArcs === undefined) {
      this.xrayArcs = new XrayArcs();
    }
    this.xrayArcs.init(this.canvasRef.nativeElement,
                    this.svgRef.nativeElement,
                    this.canvasWidth,
                    this.canvasHeight,
                    this._setArcChanged.bind(this));
    if (this._imageURI !== undefined) {
      this.xrayArcs.show(this._imageURI);
    }
    this._isInit = true;
  }

  selectLines() {
    this.editLineMode = false;
    this.strikeLineMode = false;
    this.selectLineMode = !this.selectLineMode;
    this.xrayArcs.editLineMode = false;
    this.xrayArcs.selectMode = this.selectLineMode;
    this.xrayArcs.stopDrawLine();
  }

  clearLineSelection() {
    this.xrayArcs.clearSelection();
  }

  startDrawLine() {
    this.editLineMode = !this.editLineMode;
    this.strikeLineMode = false;

    this.selectLineMode = false;
    this.xrayArcs.selectMode = false;
    this.xrayArcs.editLineMode = this.editLineMode;

    if (this.editLineMode) {
      this.xrayArcs.startDrawLine();
    }
  }

  startDrawStrikeLine() {
    this.strikeLineMode = !this.strikeLineMode;
    this.editLineMode = false;
    this.selectLineMode = false;

    this.xrayArcs.editLineMode = this.strikeLineMode;
    this.xrayArcs.selectMode = false;
    if (this.startDrawLine) {
      this.xrayArcs.startDrawStrikeLine();
    }
  }

  deleteSelectedLines() {
    this.modalService.warning({
      nzTitle: 'Все выделенные линии будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.xrayArcs.deleteSelectedLines()
            .forEach((angle: ArcAngle) => this.removeAngle.emit(angle));
      },
      nzZIndex: 1200,
    });
  }

  deleteLines() {
    this.modalService.warning({
      nzTitle: 'Все линии будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.xrayArcs.deleteLines()
            .forEach((angle: ArcAngle) => this.removeAngle.emit(angle));
        this.changeArc.emit();
      },
      nzZIndex: 1200,
    });
  }

  private _setArcChanged() {
    this.changeArc.emit();
  }
}
