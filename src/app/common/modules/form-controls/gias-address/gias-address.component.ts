import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sl-gias-address',
  templateUrl: './gias-address.component.html',
  styleUrls: ['./gias-address.component.less'],
})
export class GiasAddressComponent {
  @Input()
  form: FormGroup;
}
