import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewEncapsulation, OnChanges } from '@angular/core';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, ViewDimensions } from '@swimlane/ngx-charts';
import { scaleBand, scaleLinear } from 'd3-scale';
import { RobotStage, RobotStageLimits } from '@common/interfaces/Robot-stage';
import { RobotStatisticLimitComponent } from '@modules/robot/robot/robot-statistic/robot-statistic-limit/robot-statistic-limit.component';
import { NzModalService } from 'ng-zorro-antd';
import { RolesUsers } from '@common/constants/roles-users.constant';

@Component({
  selector: 'sl-robot-statistic',
  templateUrl: './robot-statistic.component.html',
  styleUrls: ['./robot-statistic.component.less'],
})
export class RobotStatisticComponent extends BaseChartComponent implements OnChanges {
  readonly ROLES_USERS = RolesUsers;

  autoScale = false;
  schemeType: string = 'ordinal';
  valueDomain: number[];
  xAxis = true;
  yAxis = true;
  showXAxisLabel = false;
  showYAxisLabel = true;
  xAxisLabel = 'Стадия';
  yAxisLabel = 'Количество';
  gradient = false;
  showGridLines = true;
  animations = true;
  @Input() statistic: RobotStage[];
  @Input() limits: RobotStageLimits[];
  @Input()
  set selectedStage(stage) {
    this._selectedStage = stage;
    if (this.results.length > 0) {
      this.results.forEach(result => result.selected = result.stage === this.selectedStage);
      this.update();
    }
  }
  get selectedStage() { return this._selectedStage; }
  @Output() stageSelected = new EventEmitter();

  private _selectedStage;
  dims: ViewDimensions;
  xSet: any;
  xDomain: any;
  yDomain: any;
  yScale: any;
  xScale: any;
  xAxisHeight: number = 46;
  yAxisWidth: number = 46;
  colors: ColorHelper;
  transform: string;
  margin: any[] = [20, 20, 20, 20];
  initialized: boolean = false;
  filter: any;
  limitsMap: { [key: string]: { optimalCount: number, criticalPercent: number } };
  results = [];
  width = 600;
  height = 400;

  constructor(
    private modalService: NzModalService,
    chartElement: ElementRef,
    zone: NgZone,
    cd: ChangeDetectorRef,
  ) {
    super(chartElement, zone, cd);
  }

  ngOnChanges() {
    let selectedIndex = this.results.findIndex(result => result.selected);
    this.limitsMap = this.limits.reduce((result, limit) => Object.assign(result, { [limit.stage]: limit }), {});
    this.results = this.statistic.map(({ count: value, stageName: name, stage }) => ({ value, name, stage }));
    if (selectedIndex === -1)  {
      const selectedStageIndex = this.results.findIndex(result => result.stage === this.selectedStage);
      selectedIndex = selectedStageIndex >= 0 ? selectedStageIndex : 0;
    }
    this.results[selectedIndex].selected = true;
    this.update();
  }

  update() {
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: false,
      legendType: this.schemeType,
    });
    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();
    this.xScale = this.getXScale(this.xSet, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);
    this.setColors();
    this.transform = `translate(${ this.dims.xOffset } , ${ this.margin[0] })`;
    if (!this.initialized) {
      this.initialized = true;
    }
  }

  getXDomain(): any[] {
    const values = [];

    for (const d of this.results) {
      if (!values.includes(d.name)) {
        values.push(d.name);
      }
    }

    this.xSet = values;
    return [];
  }

  getYDomain(): any[] {
    if (this.valueDomain) {
      return this.valueDomain;
    }

    const domain = [];

    for (const d of this.results) {
      if (domain.indexOf(d.value) < 0) {
        domain.push(d.value);
      }
    }

    let min = Math.min(...domain);
    const max = Math.max(...domain);
    if (!this.autoScale) {
      min = Math.min(0, min);
    }

    return [min, max];
  }

  getXScale(domain, width): any {
    return scaleBand()
      .range([0, width])
      .paddingInner(0.1)
      .domain(domain);
  }

  getYScale(domain, height): any {
    const scale = scaleLinear()
      .range([height, 0])
      .domain(domain);

    return scale;
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, this.schemeType, this.xSet, this.customColors);
  }

  updateYAxisWidth({ width }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }): void {
    this.xAxisHeight = height;
    this.update();
  }

  customColors = (label) => {
    const data = this.statistic.find(statistic => statistic.stageName === label);
    const { criticalPercent: critical, optimalCount: optimal } = this.limitsMap[data.stage];
    const count = data.count;
    switch (true) {
      case count > optimal + optimal * (critical / 100):
        return '#f5222d';
      case count > optimal:
        return '#ffa940';
      default:
        return '#52c41a';
    }
  }

  selected(data) {
    this.results.map(result => result.selected = false);
    data.selected = true;
    this.stageSelected.emit(data);
  }

  changeLimits() {
    const modal = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: RobotStatisticLimitComponent,
      nzComponentParams: {
        limits: this.limits,
      },
      nzFooter: null,
      nzWidth: 600,
    });
    modal
      .afterClose
      .subscribe(
        () => this.update(),
      );
  }
}
