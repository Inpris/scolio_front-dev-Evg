import * as d3 from 'd3';
import { D3Selection, D3SVGSelection, GeometryUtils, PointGeometry, LineGeometry,
  LabelRectangleGeometry, ArcGeometry, RectangleGeometry, D3SignGroupSelection, SignGroupDatum, SignLabelDatum, D3SignLabelRectSelection } from './geometry-utils';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MesurementType } from '@common/interfaces/Measurement';

export class AngleSign {
  static readonly angleRadius = 180;
  static readonly pointRadius = 0;
  static readonly labelOffset = 40;
  static readonly labelRectHeight = 26;
  static readonly defaultLableFontSize = 20;
  static readonly arcStyle = 'stroke: #91d5ff; stroke-width:1; fill:none';
  static readonly angleTextStyle = AngleSign.getSignLabelStyle(AngleSign.defaultLableFontSize);
  static readonly agnleBackgroundStyle = 'fill: white';
  static readonly offset = 5;
  static readonly labelSignOffset = 2;

  static showSign(line1: D3Selection,
                  line2: D3Selection,
                  imageWidth: number,
                  imageHeight: number,
                  type: MesurementType,
                  scale: number,
                  arcGroup: D3Selection,
                  svg: D3SVGSelection): Subject<number> {
    const line1Geometry = GeometryUtils.getLineGeometry(line1);
    const line2Geometry = GeometryUtils.getLineGeometry(line2);

    const line1id = line1.datum().id;
    const line2id = line2.datum().id;

    let dublicateAngle;
    svg.selectAll('.sign_group').each((group: SignGroupDatum) => {
      if ((((group.line1id === line1id) && (group.line2id === line2id)) ||
          ((group.line1id === line2id) && (group.line2id === line1id))) && (group.type === type)) {
        dublicateAngle = group.angle;
        return;
      }
    });

    if (dublicateAngle) {
      return new BehaviorSubject(dublicateAngle);
    }

    const startPoint =
      GeometryUtils.getIntersectionPoint(line1Geometry,
                                     line2Geometry);

    const signGroup: D3SignGroupSelection =
      svg.data([{ line1id, line2id, type, angle: null }])
         .append('g')
         .attr('id', `sign_group_${line1.attr('id')}_${line2.attr('id')}`)
         .attr('class', 'sign_group');

    signGroup.append('circle')
      .attr('cx', startPoint.x)
      .attr('cy', startPoint.y)
      .attr('r', AngleSign.pointRadius)
      .attr('style', 'fill: red')
      .attr('class', 'signPoint');

    const { arcPoint1, arcPoint2 } = AngleSign.getArcGeometry(startPoint, line1Geometry, line2Geometry, signGroup, scale);

    const angle =  Math.round(
      GeometryUtils.getAngle(arcPoint1.x, arcPoint1.y, startPoint.x, startPoint.y,
                             arcPoint2.x, arcPoint2.y, startPoint.x, startPoint.y));
    const miiddlePoint = AngleSign.getMiddlePoint(arcPoint2, arcPoint1, signGroup);
    const invertPoint =
      AngleSign.getPointOnLine(miiddlePoint, startPoint,   -1 * AngleSign.labelOffset, signGroup);
    const arcControlPoint =
      AngleSign.getPointOnLine(miiddlePoint, startPoint, -AngleSign.labelOffset, signGroup);

    AngleSign.drawArc(arcPoint1, arcPoint2, arcControlPoint,  scale, line1id, line2id, arcGroup);
    const arcMiddlePoint = AngleSign.getAngleArcMiddlePoint(arcPoint1, arcPoint2, arcControlPoint);
    AngleSign.addLabel(invertPoint.x, invertPoint.y, angle, arcMiddlePoint, imageWidth, imageHeight, scale, signGroup, svg);

    signGroup.data([{ line1id, line2id, angle, type }]);
    return new BehaviorSubject(angle);

  }

  static getNearestPointOfInterceptPoint(intersectPoint: PointGeometry, line: LineGeometry): PointGeometry {
    if (GeometryUtils.isPointOnLineSegment(line, intersectPoint)) {
      return intersectPoint;
    }
    return AngleSign.getLength(intersectPoint, line.startPoint) < AngleSign.getLength(intersectPoint, line.endPoint) ?
      { x: line.x1, y: line.y1 } : { x: line.x2, y: line.y2 };
  }

  static getFarthestPointOfInterceptPoint(point: PointGeometry, line: LineGeometry): PointGeometry {
    return AngleSign.getLength(point, line.startPoint) > AngleSign.getLength(point, line.endPoint) ? line.startPoint : line.endPoint;
  }

  static getLength(startPoint: PointGeometry, endPoint: PointGeometry): number {
    return Math.sqrt((endPoint.x - startPoint.x) * (endPoint.x - startPoint.x) + (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y));
  }

  static getPointOnLine(startPoint: PointGeometry, endPoint: PointGeometry, distance: number, group: D3SignGroupSelection): PointGeometry {
    const x1 = startPoint.x;
    const y1 = startPoint.y;
    const x2 = endPoint.x;
    const y2 = endPoint.y;

    if ((x1 === x2) && (y1 === y2)) {
      return { x: x1, y: y1 };
    }
    const ab = Math.abs(AngleSign.getLength(startPoint, endPoint));
    const ac = distance;
    const cb = ab - ac;

    const lambda = ac / cb;
    const x = (x1 + lambda * x2) / (1 + lambda);
    const y = (y1 + lambda * y2) / (1 +  lambda);

    group.append('circle')
         .attr('cx', x)
         .attr('cy', y)
         .attr('r', AngleSign.pointRadius)
         .attr('class', 'signPoint')
         .attr('style', 'fill: green');
    return { x, y };
  }

  static drawArc(startPoint: PointGeometry, endPoint: PointGeometry,
                 controlPoint: PointGeometry, scale: number,
                 line1Id: number, line2Id: number,
                 group: D3Selection) {
    group.append('path')
         .data([{ line1Id, line2Id, startPoint: AngleSign.getUnzoomPointGeometry(startPoint, scale),
           endPoint: AngleSign.getUnzoomPointGeometry(endPoint, scale),
           controlPoint: AngleSign.getUnzoomPointGeometry(controlPoint, scale)}])
         .attr('d', `M${startPoint.x},${startPoint.y} Q${controlPoint.x} ${controlPoint.y} ${endPoint.x},${endPoint.y}`)
         .attr('class', 'sign-arc')
         .attr('style', AngleSign.arcStyle);
  }

  static getMiddlePoint(startPoint: PointGeometry, endPoint: PointGeometry, group: D3SignGroupSelection): PointGeometry {
    const fullLength = AngleSign.getLength(startPoint, endPoint);
    return AngleSign.getPointOnLine(startPoint, endPoint, fullLength / 2, group);
  }

  static getAngle(line1: D3Selection,
                  line2: D3Selection): number {
    const line1Geometry = GeometryUtils.getLineGeometry(line1);
    const line2Geometry = GeometryUtils.getLineGeometry(line2);

    const angle =
      GeometryUtils.getAngle(line1Geometry.x1, line1Geometry.y1, line1Geometry.x2, line1Geometry.y2,
                             line2Geometry.x1, line2Geometry.y1, line2Geometry.x2, line2Geometry.y2);
    return angle;
  }

  static addLabel(x, y, label: string | number, arcMiddlePoint: PointGeometry,
                  imageWidth: number, imageHeight: number,
                  scale: number, group: D3SignGroupSelection, svg: D3SVGSelection) {
    const labelGroup = group.append('g').attr('id', 'label-group');
    const textElement =
      labelGroup.selectAll('text').data([{}]).enter().append('text')
                .attr('text-anchor', 'middle')
                .attr('class', 'signPoint')
                .text(label);
    const textNode: SVGTSpanElement = <SVGTSpanElement>textElement.node();
    const boundingRectangle = textNode.getBoundingClientRect();
    const textLength = boundingRectangle.width + this.labelSignOffset;
    const textHeight = boundingRectangle.height + this.labelSignOffset;

    let labelRectangleGeometry =
      AngleSign.getLabelRectangleGeometry({ x, y }, textLength, textHeight,
         AngleSign.defaultLableFontSize, imageWidth * scale, imageHeight * scale, scale);
    textElement.attr('x', labelRectangleGeometry.textX)
               .attr('y', labelRectangleGeometry.textY)
               .attr('class', 'sign-label-text');

    svg.selectAll('#label-group rect')
       .nodes()
       .map(node => <D3SignLabelRectSelection>d3.select(node))
       .sort((a: D3SignLabelRectSelection, b: D3SignLabelRectSelection) => a.datum().x - b.datum().x)
       .forEach((rectangle: D3SignLabelRectSelection) => {
         const oldLabelRectangleGeometry = GeometryUtils.getRectangleGeometry(rectangle);

         if (GeometryUtils.getIsRectanglesIntersect(labelRectangleGeometry, oldLabelRectangleGeometry)) {
           const newX = oldLabelRectangleGeometry.x + oldLabelRectangleGeometry.width + AngleSign.offset * 2 + textLength / 2;
           labelRectangleGeometry = AngleSign.getLabelRectangleGeometry({ y, x: newX }, textLength, textHeight,
             AngleSign.defaultLableFontSize, imageWidth * scale, imageHeight * scale, scale);
         }
       });

    const originRectangleGeometry = AngleSign.getUnzoomLabelRectangleGeometry(labelRectangleGeometry, scale);
    textElement.data([{ textLength, textHeight, x: originRectangleGeometry.textX, y: originRectangleGeometry.textY,
      fontSize: originRectangleGeometry.fontSize, defaultScale: originRectangleGeometry.defaultScale }]);
    textElement.attr('x', labelRectangleGeometry.textX)
               .attr('style', (d: SignLabelDatum) => AngleSign.getSignLabelStyle(d.fontSize));

    labelGroup.selectAll('rect')
              .data([originRectangleGeometry])
              .enter()
              .insert('rect', 'text')
              .attr('x', labelRectangleGeometry.x)
              .attr('y', labelRectangleGeometry.y)
              .attr('width', labelRectangleGeometry.width)
              .attr('height', labelRectangleGeometry.height)
              .attr('style', AngleSign.agnleBackgroundStyle)
              .attr('class', 'sign-label-background');
  }

  static getSignLabelStyle(fontSize: number) {
    return `font-size: ${fontSize}px; font-family: sans-serif; font-weight: bold; fill: black;`;
  }

  static getLabelRectangleGeometry(textPosition: PointGeometry, textLength: number, textHeight: number,
                                   fontSize: number, imageWidth: number, imageHeight: number,
                                   defaultScale: number): LabelRectangleGeometry {
    const xOffset = this.labelSignOffset;
    const yOffset = this.labelSignOffset;
    let x = textPosition.x  - textLength / 2 - xOffset;
    let y = textPosition.y - textHeight + yOffset;
    let endX = textPosition.x  + textLength / 2 + xOffset;
    let endY = textPosition.y - textHeight + yOffset + textHeight;
    const correctTextPosition = { x: textPosition.x, y: textPosition.y };
    if (x < 0) {
      x = AngleSign.offset;
      endX = x + textLength + AngleSign.offset * 2;
      correctTextPosition.x = x + AngleSign.offset + textLength / 2;
    }
    if (x > imageWidth) {
      x = imageWidth - AngleSign.offset * 3 - textLength;
      endX = imageWidth - AngleSign.offset;
      correctTextPosition.x = x + AngleSign.offset + textLength / 2;
    }
    if (y < 0) {
      y =  AngleSign.offset;
      endY = y + AngleSign.offset + textHeight;
      correctTextPosition.y = y + textHeight - yOffset;
    }
    if (y > imageHeight) {
      y = imageHeight - AngleSign.offset - textHeight;
      endY = imageHeight - AngleSign.offset;
      correctTextPosition.y = y + AngleSign.offset * 2;
    }

    return { x, y, endX, endY, fontSize, defaultScale, textLength, textHeight,
      textX: correctTextPosition.x, textY: correctTextPosition.y,
      width: textLength + xOffset * 2, height: textHeight,
    };
  }

  static getUnzoomLabelRectangleGeometry(rectangleGeometry: LabelRectangleGeometry, scale: number): LabelRectangleGeometry {
    return {
      x: rectangleGeometry.x / scale,
      y: rectangleGeometry.y / scale,
      width: rectangleGeometry.width,
      height: rectangleGeometry.height,
      textX: rectangleGeometry.textX / scale,
      textY: rectangleGeometry.textY / scale,
      textLength: rectangleGeometry.textLength,
      textHeight: rectangleGeometry.textHeight,
      endX: rectangleGeometry.endX / scale,
      endY: rectangleGeometry.endY / scale,
      fontSize: rectangleGeometry.fontSize,
      defaultScale: rectangleGeometry.defaultScale,
    };
  }

  static getZoomRectangleGeometry(rectangleGeometry: RectangleGeometry, scale: number): RectangleGeometry {
    return {
      x: rectangleGeometry.x * scale,
      y: rectangleGeometry.y * scale,
      width: rectangleGeometry.width,
      height: rectangleGeometry.height,
      endX: rectangleGeometry.endX * scale,
      endY: rectangleGeometry.endY * scale,
    };
  }

  static getZoomPointGeometry(pointGeometry: PointGeometry, scale: number) {
    return {
      x: pointGeometry.x * scale,
      y: pointGeometry.y * scale,
    };
  }

  static getUnzoomPointGeometry(pointGeometry: PointGeometry, scale: number) {
    return {
      x: pointGeometry.x / scale,
      y: pointGeometry.y / scale,
    };
  }

  static getArcGeometry(startPoint: PointGeometry,
                        line1Geometry: LineGeometry,
                        line2Geometry: LineGeometry,
                        group: D3SignGroupSelection,
                        scale: number): ArcGeometry {
    const line1NearInterceptPoint = AngleSign.getNearestPointOfInterceptPoint(startPoint, line1Geometry);
    const kLength = AngleSign.getLength(line1NearInterceptPoint, startPoint);
    const line1Length = AngleSign.getLength(line1Geometry.startPoint, line1Geometry.endPoint);

    const line2NearInterceptPoint = AngleSign.getNearestPointOfInterceptPoint(startPoint, line2Geometry);
    const lLength = AngleSign.getLength(line2NearInterceptPoint, startPoint);
    const line2Length = AngleSign.getLength(line2Geometry.startPoint, line2Geometry.endPoint);

    const line1FarInterceptPoint =
      AngleSign.getFarthestPointOfInterceptPoint(startPoint, line1Geometry);
    const line2FarInterceptPoint =
      AngleSign.getFarthestPointOfInterceptPoint(startPoint, line2Geometry);

    const kLegLength = AngleSign.getLength(line1NearInterceptPoint, line1FarInterceptPoint);
    const lLegLength = AngleSign.getLength(line2NearInterceptPoint, line2FarInterceptPoint);

    let arcPoint1: PointGeometry;
    let arcPoint2: PointGeometry;
    let arcRadius: number = 0;

    const radiusOffset = 10;
    const accuracy = 0.5;

    if ((kLength <= accuracy) && (lLength <= accuracy)) {
      arcRadius = AngleSign.angleRadius;
      switch (true)  {
        case (kLegLength < arcRadius) && (kLegLength < lLegLength):
          arcRadius = kLegLength - radiusOffset;
          break;
        case (lLegLength < arcRadius) && (lLegLength < kLegLength):
          arcRadius = lLegLength - radiusOffset;
          break;
        default: break;
      }

      arcPoint1 = AngleSign.getPointOnLine(startPoint, line1FarInterceptPoint, arcRadius, group);
      arcPoint2 = AngleSign.getPointOnLine(startPoint, line2FarInterceptPoint, arcRadius, group);
      return { arcPoint1, arcPoint2 };
    }

    if (line1Length < line2Length) {
      const radius = (line1Length > AngleSign.angleRadius) ? -AngleSign.angleRadius : -line1Length;
      arcPoint1 = (kLength === 0) ?
        AngleSign.getPointOnLine(line1NearInterceptPoint, line1FarInterceptPoint, -radius - radiusOffset, group) :
        AngleSign.getPointOnLine(line1NearInterceptPoint, startPoint, radius + radiusOffset, group);
      arcRadius = AngleSign.getLength(arcPoint1, startPoint);
      arcPoint2 = (lLength === 0) ?
        AngleSign.getPointOnLine(line2NearInterceptPoint, line2FarInterceptPoint, arcRadius, group)
        : AngleSign.getPointOnLine(line2NearInterceptPoint, startPoint,  -arcRadius + kLength, group);
    } else {
      const radius = (line2Length > AngleSign.angleRadius) ? -AngleSign.angleRadius : -line2Length;
      arcPoint2 = (lLength === 0) ?
        AngleSign.getPointOnLine(line2NearInterceptPoint, line2FarInterceptPoint, -radius - radiusOffset, group) :
        AngleSign.getPointOnLine(line2NearInterceptPoint, startPoint, radius + radiusOffset, group);
      arcRadius = AngleSign.getLength(arcPoint2, startPoint);
      arcPoint1 = (kLength === 0) ?
      AngleSign.getPointOnLine(line2NearInterceptPoint, line1FarInterceptPoint,  arcRadius, group)
        : AngleSign.getPointOnLine(line1NearInterceptPoint, startPoint, -arcRadius + lLength, group);
    }

    return { arcPoint1, arcPoint2 };
  }

  static getAngleArcMiddlePoint(arcPoint1, arcPoint2, controlPoint): PointGeometry {
    const t = 0.5;
    const x = Math.pow(1 - t, 2) * arcPoint1.x + 2 * t * (1 - t) * controlPoint.x + Math.pow(t, 2) * arcPoint2.x;
    const y = Math.pow(1 - t, 2) * arcPoint1.y + 2 * t * (1 - t) * controlPoint.y + Math.pow(t, 2) * arcPoint2.y;
    return { x, y };
  }
}
