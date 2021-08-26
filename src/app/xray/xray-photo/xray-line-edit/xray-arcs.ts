import * as d3 from 'd3';
import { GeometryUtils, PointGeometry, D3SVGSelection, D3Selection, ElementDatum,
  D3ArcLineSelection, ArcLineDatum, D3LabelTextSelection,
  D3SignLabelRectSelection, D3SignArcSelection, SignLabelDatum, D3SignGroupSelection, SignArcDatum } from '@modules/xray/xray-photo/xray-line-edit/geometry-utils';

import { AngleSign } from '@modules/xray/xray-photo/xray-line-edit/angle-sign';
import { Modification } from '@modules/xray/xray-photo/xray-photo-edit/modification';
import { Observable } from 'rxjs/Observable';
import { VertebraTorsion, MesurementType, ArcAngle } from '@common/interfaces/Measurement';
import { Subject } from 'rxjs/Subject';

export class XrayArcs {
  private _canvasElement: HTMLCanvasElement;
  private _svgElement: D3SVGSelection;
  private _width: number;
  private _height: number;
  private _containerWidth: number;
  private _containerHeight: number;
  private _canvasContext: CanvasRenderingContext2D;
  private _activeLine: D3ArcLineSelection;
  private _lineIdIndex: number = 0;
  private _image: HTMLImageElement;

  private _isLineEdit = false;
  private _isSelectMode = false;
  private _isLineEditMode = false;
  private _isStrikeLineEdit = false;
  private _isShowSelectRectangle = false;

  set selectMode(isSelectMode) {
    if (isSelectMode && !this._isSelectMode) {
      this.addDragEvents();
    }
    if (!isSelectMode && this._isSelectMode) {
      this.removeDragEvents();
    }
    this._isSelectMode = isSelectMode;
  }
  set editLineMode(isLineEditMode) {
    if (isLineEditMode && !this._isLineEditMode) {
      this.addDragEvents();
    }
    if (!isLineEditMode && this._isLineEditMode) {
      this.removeDragEvents();
    }
    this._isLineEditMode = isLineEditMode;
  }

  private _lineGroup: D3Selection;
  private _arcGroup: D3Selection;

  private _selectedLines: any[] = [];
  private _centeredOffset: string;

  private _startSelectPoint: PointGeometry;
  private _selectBox: D3Selection;
  private _modification: Modification;
  private _changeArcCallBack: Function;

  readonly markWidth = 10;
  readonly defaultLineStyle = 'stroke: #bae637; stroke-width: 2px;';
  readonly selectedLineStyle = 'stroke: red; stroke-width: 2px;';
  readonly lineSelectAreaStyle = 'stroke: #00000001; stroke-width: 10px;';
  readonly selectBoxStyle = 'stroke: #FF9806; stroke-width: 4px; stroke-dasharray: 8; fill: none;';
  readonly linePrefix = 'line';
  readonly selectAreaPrefix = '_selectArea';
  readonly lineGroupPrefix = 'lineGroup';
  readonly arcGroupPrefix = 'arcGroup';

  constructor() {}

  init(canvasElement: HTMLCanvasElement,
       svgElement: SVGGElement,
       width: number, height: number,
       changeArcCallback: Function) {

    this._canvasElement = canvasElement;
    d3.select(canvasElement)
      .attr('class', 'photo-canvas-container');

    this._svgElement =
      d3.select(svgElement)
        .attr('class', 'container-svg');

    this._width = width;
    this._height = height;
    this._containerWidth = width;
    this._containerHeight = height;
    this._changeArcCallBack = changeArcCallback;

    this._lineGroup =
      this._svgElement
          .append('g')
          .attr('id', this.lineGroupPrefix);
    this._arcGroup =
      this._svgElement
          .append('g')
          .attr('id', this.arcGroupPrefix);
  }

  show(imageURI: string) {
    this._canvasContext = this._canvasElement.getContext('2d');
    const image = document.createElement('img');
    image.onload = () => {
      this._canvasContext.clearRect(0, 0, this._width, this._height);

      this._width = image.width;
      this._height = image.height;

      d3.select(this._canvasElement)
      .attr('width',  this._width)
      .attr('height', this._height);

      this._svgElement
          .attr('width', this._width)
          .attr('height', this._height);

      this._canvasContext.drawImage(image, 0, 0);
      this._modification = new Modification(image, image.width, image.height, this._containerWidth,
        this._containerHeight, this._svgElement, d3.select(this._canvasElement), this._canvasContext);
      this._modification.centered();
      this._modification.applyAllModifing();
    };
    image.src = imageURI;
    this._image = image;

  }

  startDrawLine() {
    this._isStrikeLineEdit = false;
    this._setLinePointerCursor();
  }

  startDrawStrikeLine() {
    this._isStrikeLineEdit = true;
    this._setLinePointerCursor();
  }

  stopDrawLine() {
    this._isLineEdit = false;
    this._setLinePointerCursor();
  }

  deleteLines(): ArcAngle[] {
    const allLines: D3Selection[] = [];
    d3.selectAll('line.activeLine').nodes().forEach(node => allLines.push(d3.select(node)));
    this._selectedLines.splice(0);
    return this._deleteLines(allLines);
  }

  deleteSelectedLines(): ArcAngle[] {
    const removedAngles: ArcAngle[] = this._deleteLines(this._selectedLines);
    this._selectedLines.splice(0);
    return removedAngles;
  }

  clearSelection() {
    this._unselectLines();
  }

  private _deleteLines(lines: D3Selection[]): ArcAngle[] {
    const removedAngles: ArcAngle[] = [];
    const signGroups: D3SignGroupSelection[] =
      this._svgElement
          .selectAll('.sign_group')
          .nodes()
          .map(node => d3.select(node));
    lines.forEach((line: D3Selection) => {
      const id = line.datum().id;
      d3.select(`#${this.linePrefix}${id}`).remove();
      d3.select(`#${this.linePrefix}${id}${this.selectAreaPrefix}`).remove();
      const linkedSignGroups = signGroups.filter((group: D3SignGroupSelection) =>
        ((group.datum().line1id === id) || (group.datum().line2id === id)));
      linkedSignGroups.forEach((group: D3SignGroupSelection) => {
        removedAngles.push({ value: group.datum().angle, type: group.datum().type });
        this._arcGroup.selectAll('path').nodes()
            .map(node => d3.select(node))
            .forEach((arcGroup) => {
              const datum: SignArcDatum = <SignArcDatum>arcGroup.datum();
              if ((datum.line1Id === id) || (datum.line2Id === id)) {
                arcGroup.remove();
              }
            });
        group.remove();
      });
    });
    return removedAngles;
  }

  getAngle(angleType: MesurementType): Observable<number> {
    let angle;
    if (this._selectedLines.length === 2) {
      const line1 = this._selectedLines[0];
      const line2 = this._selectedLines[1];

      const line1Geometry = GeometryUtils.getLineGeometry(line1);
      const line2Geometry = GeometryUtils.getLineGeometry(line2);

      angle = GeometryUtils.getAngle(line1Geometry.x1, line1Geometry.y1,
                                    line1Geometry.x2, line1Geometry.y2,
                                    line2Geometry.x1, line2Geometry.y1,
                                    line2Geometry.x2, line2Geometry.y2);
      return AngleSign.showSign(line1, line2,
        this._modification.imageWidth, this._modification.imageHeight, angleType,
        this._modification.zoom.scale, this._arcGroup, this._svgElement);
    }

    let messageText;
    if (this._selectedLines.length === 0) {
      messageText = 'Не выбрана ни одна линия';
    }
    if (this._selectedLines.length === 1) {
      messageText = 'Выбрано слишком мало линий: выберите две линии';
    }
    if (this._selectedLines.length > 2) {
      messageText = 'Выбрано слишком много линий: выберите две линии';
    }
    return Observable.throw(messageText);
  }

  getTorsion(): Observable<VertebraTorsion> {
    if (this._selectedLines.length === 2) {
      const line1Geometry = GeometryUtils.getLineGeometry(this._selectedLines[0]);
      const line2Geometry = GeometryUtils.getLineGeometry(this._selectedLines[1]);
      this._unselectLines();
      return Observable.of({
        segment1Length: GeometryUtils.getLineLength(line1Geometry),
        segment2Length: GeometryUtils.getLineLength(line2Geometry) });
    }

    let messageText;
    if (this._selectedLines.length === 0) {
      messageText = 'Не выбрана ни одна линия';
    }
    if (this._selectedLines.length === 1) {
      messageText = 'Выбрано слишком мало линий: выберите две линии';
    }
    if (this._selectedLines.length > 2) {
      messageText = 'Выбрано слишком много линий: выберите две линии';
    }
    return Observable.throw(messageText);
  }

  getAsJpgImage(): Observable<string> {
    const imageURL = new Subject<string>();
    this._unselectLines();
    const currentZoom = this._modification.zoom.scale;
    this.zoom(1);

    const svgString = (new XMLSerializer()).serializeToString(this._svgElement.node());

    const image = new Image();
    image.onload = () => {
      this._canvasContext.drawImage(image, 0, 0);
      const dataURL = this._canvasElement.toDataURL('image/jpeg');
      this._modification.drawImage();

      imageURL.next(dataURL);
      this.zoom(currentZoom);
    };
    image.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    return imageURL;
  }


  private _getEventCoordinates() {
    const svg = this._svgElement.node();
    const container = svg.parentElement;
    return { x: d3.event.x + container.scrollLeft,
      y: d3.event.y + container.scrollTop,
      startX: d3.event.x + container.scrollLeft - d3.event.dx,
      startY: d3.event.y + container.scrollTop - d3.event.dy};
  }

  private _mousemoveHandler() {
    const eventCoordinate = this._getEventCoordinates();
    if (this._isStrikeLineEdit) {
      if ((Math.abs(d3.event.dx)) < Math.abs(d3.event.dy)) {
        this._activeLine.data()[0].x2 = this._activeLine.datum().x1;
        this._activeLine.data()[0].y2 = this._unZoom(eventCoordinate.y);
      } else {
        this._activeLine.data()[0].x2 = this._unZoom(eventCoordinate.x);
        this._activeLine.data()[0].y2 = this._activeLine.datum().y1;
      }
    } else {
      this._activeLine.data()[0].x2 = this._unZoom(eventCoordinate.x);
      this._activeLine.data()[0].y2 = this._unZoom(eventCoordinate.y);
    }
    this._activeLine
        .attr('x2', d => this._zoom(d.x2))
        .attr('y2', d => this._zoom(d.y2));
  }

  private _startCreateLineHandler() {
    const eventCoordinate = this._getEventCoordinates();
    this._activeLine =
      this._lineGroup
          .datum({ id: this._lineIdIndex,
            x1: this._unZoom(eventCoordinate.x),
            y1: this._unZoom(eventCoordinate.y),
            isSelected: false,
          })
          .append('line')
          .attr('id', d => `${this.linePrefix}${d.id}`)
          .attr('x1', d => this._zoom(d.x1))
          .attr('y1', d => this._zoom(d.y1))
          .attr('x2', d => this._zoom(d.x1))
          .attr('y2', d => this._zoom(d.y1))
          .attr('style', this.defaultLineStyle)
          .attr('class', 'arcLine activeLine');
    this._isLineEdit = true;
  }

  private _endCreateLineHandler() {
    this._isLineEdit = false;
    this._svgElement.on('mousemove', null);
    const activeLineGeometry = GeometryUtils.getLineGeometry(this._activeLine);
    const datum = this._activeLine.data()[0];

    if (datum.x2 === undefined || datum.y2 === undefined) {
      d3.select(`#${this.linePrefix}${datum.id}`).remove();
      return;
    }

    this._lineGroup
        .datum({ id: this._lineIdIndex, isSelected: false, x1: this._unZoom(activeLineGeometry.x1), y1: this._unZoom(activeLineGeometry.y1),
          x2: this._unZoom(activeLineGeometry.x2), y2: this._unZoom(activeLineGeometry.y2) })
        .append('line')
        .attr('id', d => `${this.linePrefix}${d.id}${this.selectAreaPrefix}`)
        .attr('x1', d => this._zoom(d.x1))
        .attr('y1', d => this._zoom(d.y1))
        .attr('x2', d => this._zoom(d.x2))
        .attr('y2', d => this._zoom(d.y2))
        .attr('style', this.lineSelectAreaStyle)
        .attr('class', 'arcLine lineSelectArea')
        .on('click', (d) => {
          this._lineSelectHandler(d);
        });
    this._lineIdIndex = this._lineIdIndex + 1;
    this._changeArcCallBack();
  }

  private _createSelectBoxHandler() {
    this._startSelectPoint = { x: this._getEventCoordinates().x, y: this._getEventCoordinates().y };
    this._selectBox =
      this._svgElement.append('rect')
          .attr('id', 'selectBox')
          .attr('x', this._getEventCoordinates().x)
          .attr('y', this._getEventCoordinates().y)
          .attr('style', this.selectBoxStyle);
    this._isShowSelectRectangle = true;
  }

  private _dragSelectBoxHandler() {
    if (this._selectBox) {
      const endPoint = { x: this._getEventCoordinates().x, y: this._getEventCoordinates().y };
      this._moveRectangle(this._startSelectPoint, endPoint, this._selectBox);
    }
  }

  private _lineSelectHandler(d: ArcLineDatum) {
    if (this._isSelectMode) {
      d3.event.stopPropagation();
      const line: D3ArcLineSelection = d3.select('#line' + d.id);
      const lineDatum = line.datum();
      if (line.datum().isSelected) {
        line.attr('style', this.defaultLineStyle);
        this._selectedLines.splice(this._selectedLines.findIndex((selectedLine) => {
          return selectedLine.datum().id === lineDatum.id;
        }), 1);
      } else {
        line.attr('style', this.selectedLineStyle);
        this._selectedLines.push(line);
      }
      line.datum().isSelected = !line.datum().isSelected;
    }
  }

  private _moveRectangle(startPoint: PointGeometry, endPoint: PointGeometry,
                         selectBox: D3Selection) {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;

    if (dx < 0) {
      selectBox.attr('x', endPoint.x).attr('width', -dx);
    } else {
      selectBox.attr('width', dx);
    }

    if (dy < 0) {
      selectBox.attr('y', endPoint.y).attr('height', -dy);
    } else {
      selectBox.attr('height', dy);
    }
  }

  private _rectangleClickHandler() {
    this._svgElement.on('mousemove', null);
    if (this._selectBox) {
      const lines = d3.selectAll('.activeLine').nodes().map(line => d3.select(line));
      const rectangleLines = GeometryUtils.getlinesInRectangle(this._selectBox, lines);
      rectangleLines.forEach((line: d3.Selection<d3.BaseType, ArcLineDatum, d3.BaseType, ElementDatum>) => {
        const foundLine = this._selectedLines.find(selectedLine => selectedLine.node() === line.node());
        if (!foundLine) {
          this._selectedLines.push(line);
        }
        line.datum().isSelected = true;
        line.attr('style', this.selectedLineStyle);
      });
      this._selectedLines.forEach(line => line.attr('style', this.selectedLineStyle));
      this._selectBox.remove();
      this._selectBox = null;
      this._svgElement.node().removeEventListener('click', this._rectangleClickHandler);
    }
  }

  private _centeredCanvas() {
    const widthOffset = Math.max((this._containerWidth - this._width) / 2, 0);
    const heightOffset = Math.max((this._containerHeight - this._height) / 2, 0);
    this._centeredOffset = `left: ${widthOffset}px; top: ${heightOffset}px;`;
    d3.select(this._canvasElement).attr('style', this._centeredOffset);
    this._svgElement.attr('style', this._centeredOffset);
  }

  private _unselectLines() {
    this._selectedLines.forEach(line => line.datum().isSelected = false);
    d3.selectAll('.activeLine').attr('style', this.defaultLineStyle);
    d3.selectAll('.lineSelectArea').nodes().forEach((line) => {
      const d3Line: d3.Selection<d3.BaseType, ArcLineDatum, d3.BaseType, ElementDatum> = d3.select(line);
      d3Line.datum().isSelected = false;
    });
    this._selectedLines.splice(0);
  }

  private _setLinePointerCursor() {
    if (this._isSelectMode) {
      this._svgElement.selectAll('.lineSelectArea').attr('style', this.lineSelectAreaStyle  + ' cursor: pointer;');
    } else {
      this._svgElement.selectAll('.lineSelectArea').attr('style', this.lineSelectAreaStyle);
    }
  }

  zoom(scale: number) {
    this._modification.zoom = { scale };
    this._modification.applyAllModifing();

    const lines: D3ArcLineSelection = d3.selectAll('.arcLine');
    lines.attr('x1', d => this._zoom(d.x1))
      .attr('y1', d => this._zoom(d.y1))
      .attr('x2', d => this._zoom(d.x2))
      .attr('y2', d => this._zoom(d.y2));


    this._svgElement.selectAll('#label-group')
        .nodes()
        .forEach((node: Element) => {
          const labelText: D3LabelTextSelection = <D3LabelTextSelection>d3.select(node.children[1]);
          const rectangle: D3SignLabelRectSelection = <D3SignLabelRectSelection>d3.select(node.children[0]);
          const rectangleDatum: SignLabelDatum = labelText.datum();
          const correctedScale = scale / rectangleDatum.defaultScale;

          labelText.attr('style', AngleSign.getSignLabelStyle(rectangleDatum.fontSize * correctedScale));
          const boundingRectangle = (<SVGTSpanElement>labelText.node()).getBoundingClientRect();
          const rectangleGeometry = AngleSign.getLabelRectangleGeometry({ x: this._zoom(rectangleDatum.x), y: this._zoom(rectangleDatum.y) },
          boundingRectangle.width, boundingRectangle.height, rectangleDatum.fontSize * correctedScale,
          this._zoom(this._width), this._zoom(this._height), rectangleDatum.defaultScale);

          labelText.attr('x', rectangleGeometry.textX)
                   .attr('y', rectangleGeometry.textY)
                   .attr('style', AngleSign.getSignLabelStyle(rectangleDatum.fontSize * correctedScale));

          rectangle.attr('x', rectangleGeometry.x)
                   .attr('y', rectangleGeometry.y)
                   .attr('height', rectangleGeometry.height)
                   .attr('width', rectangleGeometry.width);

        });

    const signArcs: D3SignArcSelection = d3.selectAll('.sign-arc');
    signArcs.attr('d', (d) => {
      const zoomStartPoint: PointGeometry = AngleSign.getZoomPointGeometry(d.startPoint, scale);
      const zoomEndPoint: PointGeometry = AngleSign.getZoomPointGeometry(d.endPoint, scale);
      const zoomControlPoint: PointGeometry = AngleSign.getZoomPointGeometry(d.controlPoint, scale);
      return `M${zoomStartPoint.x},${zoomStartPoint.y} Q${zoomControlPoint.x} ${zoomControlPoint.y} ${zoomEndPoint.x},${zoomEndPoint.y}`;
    });
  }

  private _zoom(coordinate: number) {
    return coordinate * this._modification.zoom.scale;
  }

  private _unZoom(coordinate: number) {
    return coordinate / this._modification.zoom.scale;
  }

  private addDragEvents() {
    this._svgElement
        .call(d3.drag()
          .on('start', () => {
            if (!this._isSelectMode) {
              if (!this._isLineEdit) {
                this._startCreateLineHandler();
              }
            } else {
              if (d3.event.sourceEvent.target === this._svgElement.node()) {
                this._createSelectBoxHandler();
              }
            }
          })
        .on('drag', () => {
          if (!this._isSelectMode) {
            if (this._isLineEdit) {
              this._mousemoveHandler();
            }
          } else {
            this._dragSelectBoxHandler();
          }
        })
        .on('end', () => {
          if (!this._isSelectMode) {
            if (this._isLineEdit) {
              this._endCreateLineHandler();
            }
          } else {
            if (this._selectBox) {
              this._rectangleClickHandler();
            }
          }
        }));
  }

  private removeDragEvents() {
    this._svgElement.on('mousedown.drag', null);
    this._svgElement.on('touchstart.drag', null);
  }
}
