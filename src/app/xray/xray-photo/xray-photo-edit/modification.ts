import { D3SVGSelection } from '@modules/xray/xray-photo/xray-line-edit/geometry-utils';

interface CropModification {
  x: number;
  y: number;
  width: number;
  height: number;
  newWidth: number;
  newHeight: number;
}

interface RotationModification {
  angle: number;
}

interface MirrorModification {
  strikeHorizontalDirection: boolean;
  strikeVerticalDirection: boolean;
}

interface ZoomModification {
  scale: number;
}

interface PositionModification {
  widthOffset: number;
  heightOffset: number;
}
export class Modification {
  public image;
  public imageWidth: number;
  public imageHeight: number;
  public containerWidth: number;
  public containerHeight: number;
  public svg: D3SVGSelection;
  public canvas: D3SVGSelection;
  public canvasContext;
  public set crop(cropObject: CropModification) {
    if (this._crop) {
      this._crop = { x: cropObject.x + this._crop.x,
        y: cropObject.y + this._crop.y,
        width: cropObject.width,
        height: cropObject.height,
        newWidth: cropObject.newWidth,
        newHeight: cropObject.newHeight,
      };
    } else {
      this._crop = cropObject;
    }
    this.imageWidth = cropObject.newWidth;
    this.imageHeight = cropObject.newHeight;
  }
  public get crop() {
    return this._crop;
  }

  public set rotate(angleObject: RotationModification) {
    if (this.rotate) {
      let angle = (this.rotate.angle + angleObject.angle) % 360;
      if (angle === 270) {
        angle = -90;
      }
      if (angle === -270) {
        angle = 90;
      }
      this._rotate = { angle };
    } else {
      this._rotate = angleObject;
    }
  }
  public get rotate(): RotationModification  {
    return this._rotate;
  }

  public mirror: MirrorModification;
  public zoom: ZoomModification;
  public position: PositionModification;

  private _crop: CropModification;
  private _rotate: RotationModification;

  private readonly _minScale = 0.1;
  private readonly _maxScale = 4;

  constructor(image, imageWidth, imageHeight, containerWidth, containerHeight, svg, canvas, canvasContext) {
    this.image = image;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.svg = svg;
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.zoom = { scale: 1 };
    this.rotate = { angle: 0 };
    this.position = { widthOffset: 0, heightOffset: 0 };
    this.mirror = { strikeHorizontalDirection: false, strikeVerticalDirection: false };
  }

  public drawImage() {
    if (this.crop) {
      this.canvasContext.drawImage(this.image, this.crop.x, this.crop.y, this.crop.width, this.crop.height,
        0, 0, this.crop.newWidth * this.zoom.scale, this.crop.newHeight * this.zoom.scale);
    } else {
      this.canvasContext.drawImage(this.image, 0, 0, this.imageWidth * this.zoom.scale, this.imageHeight *  this.zoom.scale);
    }
  }

  public getRotatioStyleString() {
    const angle = this.rotate.angle;
    let styleString = `rotate(${angle}deg)`;

    if (angle === 90) {
      styleString +=  this._getTranslateYString(-this.imageHeight);
    }
    if ((angle === -90)) {
      styleString += this._getTranslateXString(-this.imageWidth);
    }

    styleString += this._getVerticalMirrorOffsetString(angle) +
      this._getGorizontalMirrorOffsetString(angle) + ';';
    return styleString;
  }

  private _getVerticalMirrorOffsetString(angle: number) {
    return (((angle === 90) || (angle === -90))  && (this.mirror.strikeVerticalDirection)) ?
        this._getTranslateXString(((angle ===  90) ? -1 : 1) * this.imageWidth) : '';
  }

  private _getGorizontalMirrorOffsetString(angle: number) {
    return (((angle === 90) || (angle === -90)) && (this.mirror.strikeHorizontalDirection)) ?
        this._getTranslateYString(((angle ===  90) ? 1 : -1) * this.imageHeight) : '';
  }

  public getMirrorStyleString() {
    return `${(this.mirror.strikeHorizontalDirection) ? 'scaleX(-1)' : ''} ${(this.mirror.strikeVerticalDirection) ? 'scaleY(-1)' : ''}`;
  }

  public getTransformOriginString() {
    return `${((this.rotate.angle === 90) || (this.rotate.angle === -90)) ? 'transform-origin: left top;' : ''}`;
  }

  public getModificationStyleString(): string  {
    return `transform:
            ${this.getMirrorStyleString()}
            ${this.getRotatioStyleString()}
            ${this.getTransformOriginString()}`;
  }

  public centered() {
    let widthOffset;
    let heightOffset;
    if ((this.rotate.angle === 0) || (this.rotate.angle === 180) || (this.rotate.angle === -180)) {
      widthOffset = Math.max((this.containerWidth - this.imageWidth * this.zoom.scale) / 2, 0) ;
      heightOffset = Math.max((this.containerHeight - this.imageHeight * this.zoom.scale) / 2, 0);
    } else {
      if (this.rotate.angle === 90) {
        widthOffset = Math.max((this.containerWidth - this.imageHeight * this.zoom.scale) / 2, 0) + this.imageHeight * this.zoom.scale;
        heightOffset = Math.max((this.containerHeight - this.imageWidth * this.zoom.scale) / 2, 0);
      }
      if (this.rotate.angle === -90) {
        widthOffset = Math.max((this.containerWidth - this.imageHeight * this.zoom.scale) / 2, 0);
        heightOffset = Math.max((this.containerHeight - this.imageWidth * this.zoom.scale) / 2, 0) + this.imageWidth * this.zoom.scale;
      }
    }

    this.position = { widthOffset, heightOffset };
  }

  public applyAllModifing(isDrawImage = true, isChangeSize = true) {
    this.centered();
    const styleString = this.getModificationStyleString();
    this.canvas
      .attr('style', styleString);

    this.svg
      .attr('style', styleString);


    if (isChangeSize) {
      this.canvas.attr('width',  this.imageWidth * this.zoom.scale)
        .attr('height', this.imageHeight * this.zoom.scale);

      this.svg
          .attr('width', this.imageWidth * this.zoom.scale)
          .attr('height', this.imageHeight * this.zoom.scale);
    }
    if (isDrawImage) {
      this.drawImage();
    }
  }

  public getIsModified() {
    return (this.crop !== undefined) || (this.zoom.scale !== 1) || (this.rotate.angle !== 0);
  }

  public getMaxWidth() {
    return this.imageWidth * this.zoom.scale;
  }

  public getMaxHeight() {
    return this.imageHeight * this.zoom.scale;
  }

  public calculateScale() {
    const scale = ((this.rotate !== undefined) && ((this.rotate.angle === 90) || (this.rotate.angle === -90)))
      ? ((this.imageHeight < this.imageWidth) ? this.containerHeight / this.imageWidth : this.containerWidth / this.imageHeight)
      : ((this.imageWidth < this.imageHeight) ? this.containerHeight / this.imageHeight : this.containerWidth / this.imageWidth);
    if (scale < this._minScale) {
      return this._minScale;
    }
    if (scale > this._maxScale) {
      return this._maxScale;
    }
    return scale;
  }

  public clearRotation() {
    this._rotate = { angle: 0 };
  }

  public clearMirror() {
    this.mirror = { strikeHorizontalDirection: false, strikeVerticalDirection: false };
  }

  public clearCrop() {
    this._crop = null;
  }

  public swapHeightWidth() {
    const imageHeight = this.imageHeight;
    this.imageHeight = this.imageWidth;
    this.imageWidth = imageHeight;
  }

  public clear(originImageWidth: number, originImageHeight: number) {
    this.imageWidth = originImageWidth;
    this.imageHeight = originImageHeight;
    this.clearRotation();
    this.clearMirror();
    this.clearCrop();
    this.applyAllModifing();
  }

  public flipHorizontylly() {
    this.mirror.strikeHorizontalDirection = !this.mirror.strikeHorizontalDirection;
  }

  public flipVertically() {
    this.mirror.strikeVerticalDirection = !this.mirror.strikeVerticalDirection;
  }

  private _getTranslateXString(offset: number) {
    return ` translateX(${offset * this.zoom.scale}px)`;
  }

  private _getTranslateYString(offset: number) {
    return ` translateY(${offset * this.zoom.scale}px)`;
  }
}
