import * as d3 from 'd3';
import { D3Selection, GeometryUtils, D3SVGSelection, RectangleGeometry, ElementDatum } from '@modules/xray/xray-photo/xray-line-edit/geometry-utils';
import { Modification } from '@modules/xray/xray-photo/xray-photo-edit/modification';

interface SizeBoxPointDatum {
  id: number;
  flag: string;
  cx: number;
  cy: number;
}

interface SizeBoxDatum extends ElementDatum {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class XrayPhoto {
  private _containerElement: D3Selection;
  private _canvasElement: HTMLCanvasElement;
  private _canvasContext: CanvasRenderingContext2D;
  private _saveCanvas: HTMLCanvasElement;
  private _svgElement: D3SVGSelection;

  private _width: number;
  private _height: number;
  private _containerWidth: number;
  private _containerHeight: number;
  private _imageWidth: number;
  private _imageHeight: number;
  private _originImageWidth: number;
  private _originImageHeight: number;

  private _sizeBoxGroup;
  private _image;
  private _activeLine;
  private _cropObject;
  private _containerAngle: number;
  private _containerScale: number = 1;

  private _centeredOffset: string;

  private _modification: Modification;

  readonly markWidth = 15;

  public _changeZoom: Function;

  constructor(containerElement: HTMLDivElement,
              canvasElement: HTMLCanvasElement,
              saveCanvas: HTMLCanvasElement,
              svgElement: SVGGElement,
              width: number,
              height: number,
              changeZoom: Function) {
    this._containerElement = d3.select(containerElement);
    this._canvasElement = canvasElement;
    d3.select(this._canvasElement)
      .attr('class', 'photo-canvas-container');
    this._saveCanvas = saveCanvas;

    this._svgElement =
      d3.select(svgElement)
        .attr('class', 'photo-svg-container');

    this._width = width;
    this._height = height;
    this._containerWidth = width;
    this._containerHeight = height;
    this._containerAngle = 0;

    this._changeZoom = changeZoom;
  }

  show(imageURI: string) {
    this._canvasContext = this._canvasElement.getContext('2d');
    const image = document.createElement('img');
    image.onload = () => {
      this._canvasContext.clearRect(0, 0, this._width, this._height);

      this._imageWidth = image.width;
      this._imageHeight = image.height;
      this._originImageWidth = image.width;
      this._originImageHeight = image.height;
      this._width = image.width;
      this._height = image.height;

      this._modification = new Modification(image, image.width, image.height, this._containerWidth,
        this._containerHeight, this._svgElement, d3.select(this._canvasElement), this._canvasContext);
      this._modification.centered();
      this._modification.applyAllModifing();
    };
    image.src = imageURI;
    this._image = image;
  }

  changeBackgroundImage(imageURI: string) {
    this.show(imageURI);
  }

  startCrop() {
    this._showSizeBox();
  }

  stopCrop() {
    this._crop();
  }

  cancelCrop() {
    this._hideSizeBox();
  }

  rotate90Clockwise() {
    this._rotate(90);
  }

  rotate90counterclockwise() {
    this._rotate(-90);
  }

  flipHorizontally() {
    this._flipHorizontylly();
  }

  flipVertically() {
    this._flipVertically();
  }

  rotate180() {
    this._rotate(180);
  }

  zoom(scale: number) {
    this._containerScale = scale;
    this._modification.zoom = { scale };
    this._modification.applyAllModifing();
    this._zoomSizeBox();
  }

  reset() {
    this._modification.clear(this._originImageWidth, this._originImageHeight);
  }

  private _rotate(angle: number) {
    this._hideSizeBox();
    this._containerAngle = (this._containerAngle + angle) % 360;
    this._modification.rotate = { angle };
    this._modification.applyAllModifing();
  }

  private _showSizeBox() {
    const svg = this._svgElement.node();
    const container = svg.parentElement;
    const sizeBoxOffset = 20;

    const x = container.scrollLeft + sizeBoxOffset;
    const y = container.scrollTop + sizeBoxOffset;

    const width = Math.min(this._canvasElement.width, container.clientWidth) - sizeBoxOffset * 2;
    const height = Math.min(this._canvasElement.height, container.clientHeight) - sizeBoxOffset * 2;

    let dX: number;
    let dY: number;
    let sizeBoxGeometry: RectangleGeometry;

    this._sizeBoxGroup =
      this._svgElement
          .append('g')
          .attr('id', 'sizeBoxGroup');

    const scale = this._modification.zoom.scale;
    const sizeBox =
      this._sizeBoxGroup
          .selectAll('rect')
          .data([{ x: x / scale, y: y / scale, width: width / scale, height: height / scale }])
          .enter()
          .append('rect')
          .attr('id', 'sizeBox')
          .attr('x', x)
          .attr('y', y)
          .attr('width', width)
          .attr('height', height)
          .attr('style', 'fill: #ffffff2b; stroke: #1890ff;; stroke-dasharray: 8; stroke-width: 4px;')
          .attr('class', 'sizeBox')
          .call(d3.drag()
            .on('start', () => {
              sizeBoxGeometry = GeometryUtils.getRectangleGeometry(sizeBox);
              dX = d3.event.x - sizeBoxGeometry.x;
              dY = d3.event.y - sizeBoxGeometry.y;
            })
            .on('drag', () => {
              this._moveSizeBox(d3.event.x - dX, d3.event.y - dY,
                sizeBoxGeometry.width, sizeBoxGeometry.height, sizeBox, this._sizeBoxGroup);
            }));

    this._sizeBoxGroup
        .append('g')
        .attr('id', 'controlPointGroup')
        .selectAll('rect')
        .data([{ id: 1, flag: 'top left', cx: x / scale, cy: y / scale },
               { id: 2, flag: 'top right', cx: x / scale + width / scale, cy: y / scale },
               { id: 3, flag: 'bottom left', cx: x / scale, cy: y / scale + height / scale },
               { id: 4, flag: 'bottom right', cx: x / scale + width / scale, cy: y / scale + height / scale }])
        .enter()
        .append('rect')
        .attr('id', (d: SizeBoxPointDatum) => 'controlPoint' + d.id)
        .attr('x', (d: SizeBoxPointDatum) => d.cx * scale - this.markWidth / 2)
        .attr('y', (d: SizeBoxPointDatum) => d.cy * scale - this.markWidth / 2)
        .attr('width', this.markWidth)
        .attr('height', this.markWidth)
        .attr('style', 'fill: #1890ff;')
        .attr('class', 'markPoint')
        .call(d3.drag().on('drag', (d: SizeBoxPointDatum) => this._dragSizeBoxHandler(d, this._sizeBoxGroup)));
  }

  private _hideSizeBox() {
    if (this._sizeBoxGroup) {
      this._sizeBoxGroup.remove();
    }
  }

  private _dragSizeBoxHandler(d: SizeBoxPointDatum, sizeBoxGroup: D3Selection) {
    const sizeBox = sizeBoxGroup.select('#sizeBox');
    const sizeBoxGeometry = GeometryUtils.getRectangleGeometry(sizeBox);
    let height = sizeBoxGeometry.height;
    let width = sizeBoxGeometry.width;
    let x = sizeBoxGeometry.x;
    let y = sizeBoxGeometry.y;

    if (d.flag.includes('top')) {
      height = (y - d3.event.y) + height;
      y = d3.event.y;
    }

    if (d.flag.includes('left')) {
      width =  (x - d3.event.x) + width;
      x = d3.event.x;
    }

    if (d.flag.includes('bottom')) {
      height = (d3.event.y - (y + height)) + height;
    }

    if (d.flag.includes('right')) {
      width = (d3.event.x - (x + width) + width);
    }

    if ((width >= 0) && (height >= 0)) {
      this._moveSizeBox(x, y, width, height, sizeBox, this._sizeBoxGroup);
    }
  }

  private _moveSizeBox(x: number, y: number, width: number, height: number,
                       sizeBox: D3Selection,
                       sizeBoxGroup: D3Selection) {
    const maxWidth = this._modification.getMaxWidth();
    const maxHeight = this._modification.getMaxHeight();
    const pointX = (x < 0) ? 0 : ((x + width > maxWidth) ? (maxWidth - width) : x);
    const pointY = (y < 0) ? 0 : ((y + height > maxHeight) ? (maxHeight - height) : y);
    const scale = this._modification.zoom.scale;

    sizeBox.data([{ x: pointX / scale, y: pointY / scale, width: width / scale, height: height / scale }])
           .attr('x', pointX)
           .attr('y', pointY)
           .attr('height', height)
           .attr('width', width);
    sizeBoxGroup.select('.sizeBox').data([{ x: pointX / scale, y: pointY / scale, width: width / scale, height: height / scale }]);

    const leftX = pointX / scale;
    const topY = pointY / scale;
    const newPointsData = new Map();
    newPointsData.set(1, { id: 1, flag: 'top left', cx: leftX, cy: topY });
    newPointsData.set(2, { id: 2, flag: 'top right', cx: leftX + width / scale, cy: topY });
    newPointsData.set(3, { id: 3, flag: 'bottom left', cx: leftX, cy: topY + height / scale });
    newPointsData.set(4, { id: 4, flag: 'bottom right', cx: leftX + width / scale, cy: topY + height / scale });

    sizeBoxGroup
      .select('#controlPointGroup')
      .selectAll('.markPoint')
      .attr('x', (d: SizeBoxPointDatum) => {
        return this.getControlPointPositionOrdinate(newPointsData.get(d.id).cx, maxWidth, scale);
      })
      .attr('y', (d: SizeBoxPointDatum) => {
        return this.getControlPointPositionOrdinate(newPointsData.get(d.id).cy, maxHeight, scale);
      });

    sizeBoxGroup.select('#controlPointGroup')
                .selectAll('.markPoint')
                .nodes()
                .forEach((node) => {
                  const point = d3.select(node);
                  const data = newPointsData.get(point.data()[0]['id']);
                  d3.select(node).data([data]);
                });
  }

  public getControlPointPositionOrdinate(ordinate: number, ordinateLimit: number, scale: number): number {
    return Math.min(Math.max(0, ordinate * scale - this.markWidth / 2), (ordinateLimit - this.markWidth));
  }

  private _crop() {
    const sizeBox = this._sizeBoxGroup.select('#sizeBox');
    const sizeBoxGeometry = GeometryUtils.getRectangleGeometry(sizeBox);
    const x = this._unZoom(sizeBoxGeometry.x);
    const y = this._unZoom(sizeBoxGeometry.y);
    const width = this._unZoom(sizeBoxGeometry.width);
    const height = this._unZoom(sizeBoxGeometry.height);

    const newWidth = width;
    const newHeight = height;

    this._imageWidth = newWidth;
    this._imageHeight = newHeight;

    this._height = newHeight;
    this._width = newWidth;

    this._modification.crop = { x, y, width, height, newWidth, newHeight };
    this._modification.imageWidth = newWidth;
    this._modification.imageHeight = newHeight;
    this._modification.applyAllModifing();
    this._modification.zoom.scale = this._modification.calculateScale();
    this._changeZoom(this._modification.zoom.scale);
    this._hideSizeBox();
  }

  getAsJpgImage(): string {
    if (this._modification.crop) {
      this._modification.imageWidth = this._modification.crop.width;
      this._modification.imageHeight = this._modification.crop.height;
    }

    const rotateAngle = this._modification.rotate.angle;
    const rotateCenter = { x: this._modification.imageWidth  / 2, y: this._modification.imageHeight / 2 };
    const scale = this._modification.zoom.scale;

    const zoomedImageWidth = this._modification.imageWidth * this._modification.zoom.scale;
    const zoomedImageHeight = this._modification.imageHeight * this._modification.zoom.scale;

    let saveImageHeight;
    let saveImageWidth;
    if ((rotateAngle !== undefined) && ((rotateAngle === 90) || (rotateAngle === -90))) {
      saveImageHeight = this._modification.imageWidth;
      saveImageWidth = this._modification.imageHeight;
    } else {
      saveImageHeight = this._modification.imageHeight;
      saveImageWidth = this._modification.imageWidth;
    }
    this._saveCanvas.width = saveImageWidth;
    this._saveCanvas.height = saveImageHeight;
    const saveCanvasContext = this._saveCanvas.getContext('2d');
    const horizontalScale = (this._modification.mirror.strikeHorizontalDirection) ? -1 : 1;
    const verticalScale = (this._modification.mirror.strikeVerticalDirection) ? -1 : 1;

    if (this._modification.crop) {
      const newCenter = { x: saveImageWidth / 2,
        y: saveImageHeight / 2 };
      saveCanvasContext.translate(newCenter.x, newCenter.y);
      saveCanvasContext.rotate(rotateAngle  * Math.PI / 180);

      let imageCenter;
      if ((rotateAngle !== undefined) && ((rotateAngle === 90) || (rotateAngle === -90))) {
        imageCenter = { x: newCenter.y, y: newCenter.x };
        saveCanvasContext.scale(verticalScale, horizontalScale);
      } else {
        imageCenter = { x: newCenter.x, y: newCenter.y };
        saveCanvasContext.scale(horizontalScale, verticalScale);
      }

      saveCanvasContext.drawImage(this._image, this._modification.crop.x, this._modification.crop.y,
        this._modification.crop.width, this._modification.crop.height,
        -imageCenter.x, -imageCenter.y, this._modification.imageWidth, this._modification.imageHeight);
    } else {
      saveCanvasContext.translate(saveImageWidth  / 2, saveImageHeight / 2);
      saveCanvasContext.rotate(rotateAngle * Math.PI / 180);
      if ((rotateAngle !== undefined) && ((rotateAngle === 90) || (rotateAngle === -90))) {
        saveCanvasContext.scale(verticalScale, horizontalScale);
      } else {
        saveCanvasContext.scale(horizontalScale, verticalScale);
      }
      saveCanvasContext.drawImage(this._image, -rotateCenter.x, -rotateCenter.y,
        this._modification.imageWidth, this._modification.imageHeight);
    }
    const dataURL = this._saveCanvas.toDataURL('image/jpeg');
    this._saveCanvas.height = 0;
    this._saveCanvas.width = 0;
    return dataURL;
  }

  private _zoom(coordinate: number) {
    return coordinate * this._modification.zoom.scale;
  }

  private _unZoom(coordinate: number) {
    return coordinate / this._modification.zoom.scale;
  }

  private _flipHorizontylly() {
    this._modification.flipHorizontylly();
    this._modification.applyAllModifing();
  }

  private _flipVertically() {
    this._modification.flipVertically();
    this._modification.applyAllModifing();
  }

  private _zoomSizeBox() {
    if (this._sizeBoxGroup) {
      const scale = this._modification.zoom.scale;
      this._sizeBoxGroup
          .select('#sizeBox')
          .attr('x', d => d.x * scale)
          .attr('y', d => d.y * scale)
          .attr('width', d => d.width * scale)
          .attr('height', d => d.height * scale);

      this._sizeBoxGroup
          .select('#controlPointGroup')
          .selectAll('.markPoint')
          .attr('x', d => this.getControlPointPositionOrdinate(d.cx, this._modification.getMaxWidth(), scale))
          .attr('y', d => this.getControlPointPositionOrdinate(d.cy, this._modification.getMaxHeight(), scale));
    }
  }
}
