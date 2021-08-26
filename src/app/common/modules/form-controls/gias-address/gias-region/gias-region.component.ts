import { Component, Input } from '@angular/core';
import { RegionService } from '@common/services/region.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sl-gias-region',
  templateUrl: './gias-region.component.html',
  styleUrls: ['./gias-region.component.less'],
  providers: [RegionService],
})
export class GiasRegionComponent {
  @Input()
  form: FormGroup;
  @Input()
  label = 'Регион';

  constructor(public regionService: RegionService) {
  }

  fromPaginationChunk = response => response.data;
}
