import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CityService } from '@common/services/city.service';

@Component({
  selector: 'sl-gias-city',
  templateUrl: './gias-city.component.html',
  styleUrls: ['./gias-city.component.less'],
  providers: [CityService],
})
export class GiasCityComponent {

  @Input()
  form: FormGroup;
  @Input()
  label = 'Город';

  constructor(public cityService: CityService) {
  }

  fromPaginationChunk = response => response.data;
}
