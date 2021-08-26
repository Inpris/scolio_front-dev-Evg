import { Selection } from 'd3';
import { MesurementType } from '@common/interfaces/Measurement';

export interface PointGeometry {
  x: number;
  y: number;
}

export interface LineGeometry {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startPoint?: PointGeometry;
  endPoint?: PointGeometry;
}

export interface RectangleGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  endX?: number;
  endY?: number;
}
export interface LabelRectangleGeometry extends RectangleGeometry {
  textX: number;
  textY: number;
  textLength: number;
  textHeight: number;
  fontSize: number;
  defaultScale: number;
}

export interface ArcGeometry {
  arcPoint1: PointGeometry;
  arcPoint2: PointGeometry;
}

export interface ElementDatum {
  id?: number;
  isSelected?: boolean;
}

export interface ArcLineDatum extends ElementDatum {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface SignLabelDatum {
  x: number;
  y: number;
  textLength: number;
  textHeight: number;
  fontSize: number;
  defaultScale: number;
}

export interface RectangleDatum extends SignLabelDatum {
  width: number;
  height: number;
  textX: number;
  textY: number;
}

export interface SignArcDatum {
  startPoint: PointGeometry;
  endPoint: PointGeometry;
  controlPoint: PointGeometry;
  line1Id: number;
  line2Id: number;
}

export interface SignGroupDatum {
  line1id: number;
  line2id: number;
  angle?: number;
  type: MesurementType;
}

export type D3Selection = Selection<d3.BaseType, ElementDatum, d3.BaseType, ElementDatum>;
export type D3SVGSelection = Selection<SVGGElement, ElementDatum, HTMLElement, ElementDatum>;
export type D3ArcLineSelection = d3.Selection<d3.BaseType, ArcLineDatum, d3.BaseType, ElementDatum>;
export type D3LabelTextSelection = d3.Selection<d3.BaseType, SignLabelDatum, d3.BaseType, ElementDatum>;
export type D3SignLabelRectSelection = d3.Selection<d3.BaseType, RectangleDatum, d3.BaseType, ElementDatum>;
export type D3SignLabelSelection = d3.Selection<d3.BaseType, SignLabelDatum, d3.BaseType, ElementDatum>;
export type D3SignArcSelection = d3.Selection<d3.BaseType, SignArcDatum, d3.BaseType, ElementDatum>;
export type D3SignGroupSelection = d3.Selection<d3.BaseType, SignGroupDatum, d3.BaseType, ElementDatum>;

export class GeometryUtils {
  static getlinesInRectangle(selectBox: D3Selection, lines: D3Selection[]): D3Selection[] {
    const rectangleGeometry = this.getRectangleGeometry(selectBox);

    return lines.filter((line) => {
      const lineGeometry = this.getLineGeometry(line);

      const topBound = { x1: rectangleGeometry.x, y1: rectangleGeometry.y, x2: rectangleGeometry.endX, y2: rectangleGeometry.y };
      const leftBound = { x1: rectangleGeometry.x, y1: rectangleGeometry.y, x2: rectangleGeometry.x, y2: rectangleGeometry.endY };
      const bottomBound = { x1: rectangleGeometry.x, y1: rectangleGeometry.endY, x2: rectangleGeometry.endX, y2: rectangleGeometry.endY };
      const rightBound = { x1: rectangleGeometry.endX, y1: rectangleGeometry.y, x2: rectangleGeometry.endX, y2: rectangleGeometry.endY };

      return GeometryUtils.isPointInRectangle(lineGeometry.startPoint, rectangleGeometry) ||
        GeometryUtils.isPointInRectangle(lineGeometry.endPoint, rectangleGeometry) ||
        GeometryUtils.isLinesIntercept(lineGeometry, topBound) ||
        GeometryUtils.isLinesIntercept(lineGeometry, leftBound) ||
        GeometryUtils.isLinesIntercept(lineGeometry, bottomBound) ||
        GeometryUtils.isLinesIntercept(lineGeometry, rightBound);
    });
  }

  static isPointInRectangle(pointGeometry: PointGeometry, rectangleGeometry: RectangleGeometry) {
    const minX = rectangleGeometry.x;
    const minY = rectangleGeometry.y;
    const maxX = rectangleGeometry.endX;
    const maxY = rectangleGeometry.endY;

    return ((minX <= pointGeometry.x) && (pointGeometry.x <= maxX) && (minY <= pointGeometry.y) && (pointGeometry.y <= maxY));
  }

  static isLinesIntercept(line1Geometry, line2Geometry) {
    const interceptPoint = GeometryUtils.getIntersectionPoint(line1Geometry, line2Geometry);
    return (interceptPoint) ?
      (GeometryUtils.isPointOnLineSegment(line1Geometry, interceptPoint) && GeometryUtils.isPointOnLineSegment(line2Geometry, interceptPoint)) : false;
  }

  static isPointOnLineSegment(line: LineGeometry, point: PointGeometry) {
    return GeometryUtils.isPointOnLine(line, point) && GeometryUtils.isPointInSegment(line, point);
  }

  static isPointOnLine(line: LineGeometry, point: PointGeometry) {
    const accuracy = 0.5;

    if (line.startPoint &&
       line.endPoint &&
       ((Math.abs(line.startPoint.x - point.x) <= accuracy &&
        Math.abs(line.startPoint.y - point.y) <= accuracy) ||
       (Math.abs(line.endPoint.x - point.x) <= accuracy &&
        Math.abs(line.endPoint.y - point.y) <= accuracy))) {
      return true;
    }

    return ((point.x - line.x1) * (line.y2 - line.y1) - (point.y - line.y1) * (line.x2 - line.x1) <= accuracy);
  }

  static isPointInSegment(line: LineGeometry, point: PointGeometry) {
    return (((line.x1 <= point.x) && (point.x <= line.x2)) || ((line.x2 <= point.x) && (point.x <= line.x1))) &&
      (((line.y1 <= point.y) && (point.y <= line.y2)) || ((line.y2 <= point.y) && (point.y <= line.y1)));
  }

  static getAngle(x1, y1, x2, y2, x3, y3, x4, y4): number {
    const dx1 = x2 - x1;
    const dy1 = y1 - y2;

    const dx2 = x4 - x3;
    const dy2 = y3 - y4;

    const t1 = dx1 * dx2 + dy1 * dy2;
    const t2 = Math.sqrt(dx1 * dx1 + dy1 * dy1) * Math.sqrt(dx2 * dx2 + dy2 * dy2);

    return Math.acos(t1 / t2) * 180 / Math.PI;
  }

  static getLineGeometry(line: D3Selection): LineGeometry {
    return {
      x1: +line.attr('x1'),
      y1: +line.attr('y1'),
      x2: +line.attr('x2'),
      y2: +line.attr('y2'),
      startPoint: { x: +line.attr('x1'), y: +line.attr('y1') },
      endPoint: { x: +line.attr('x2'), y: +line.attr('y2') }};
  }

  static getOriginLineGeometry(line: D3Selection, scale: number): LineGeometry {
    const lineGeometry = GeometryUtils.getLineGeometry(line);

    return { x1: lineGeometry.x1 / scale, y1: lineGeometry.y1 / scale, x2: lineGeometry.x2, y2: lineGeometry.y2,
      startPoint: { x: lineGeometry.x1 / scale, y: lineGeometry.y1 / scale },
      endPoint: { x: lineGeometry.x2 / scale, y: lineGeometry.y2 / scale } };

  }

  static getRectangleGeometry(rectangle: D3Selection | D3SignLabelRectSelection): RectangleGeometry {
    return {
      x: +rectangle.attr('x'),
      y: +rectangle.attr('y'),
      width: +rectangle.attr('width'),
      height: +rectangle.attr('height'),
      endX: +rectangle.attr('x') + +rectangle.attr('width'),
      endY: +rectangle.attr('y') + +rectangle.attr('height'),
    };
  }

  static getLineGeometryFromPoints(startPoint: PointGeometry, endPoint: PointGeometry) {
    return {
      startPoint,
      endPoint,
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y};
  }

  static getRectangleGeometryFromPoints(x: number, y: number, width: number, height: number) {
    return {
      x,
      y,
      width,
      height,
      endX: x + width,
      endY: y + height,
    };
  }

  static getIntersectionPoint(line1: LineGeometry, line2: LineGeometry): PointGeometry {
    const x1 = line1.x1;
    const y1 = line1.y1;
    const x2 = line1.x2;
    const y2 = line1.y2;

    const x3 = line2.x1;
    const y3 = line2.y1;
    const x4 = line2.x2;
    const y4 = line2.y2;

    if ((((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)) === 0) || ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4) === 0)) {
      return null;
    }

    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    return { x, y };
  }

  static getLineLength(line: LineGeometry) {
    return Math.sqrt(Math.pow((line.x2 - line.x1), 2) + Math.pow((line.y2 - line.y1), 2));
  }

  static getIsPointInRectangle(point: PointGeometry, rectangle: RectangleGeometry) {
    return ((rectangle.x <= point.x) && (point.x <= rectangle.endX) && (rectangle.y <= point.y) && (point.y <= rectangle.endY));
  }

  static getIsRectanglesIntersect(rectangle1: RectangleGeometry, rectangle2: RectangleGeometry) {
    return GeometryUtils.getIsPointInRectangle({ x: rectangle1.x, y: rectangle1.y }, rectangle2) ||
           GeometryUtils.getIsPointInRectangle({ x: rectangle1.x, y: rectangle1.endY }, rectangle2) ||
           GeometryUtils.getIsPointInRectangle({ x: rectangle1.endX, y: rectangle1.y }, rectangle2) ||
           GeometryUtils.getIsPointInRectangle({ x: rectangle1.endX, y: rectangle1.endY }, rectangle2);
  }
}
