import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sl-accept-terms',
  templateUrl: './accept-terms.component.html',
  styleUrls: ['./accept-terms.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptTermsComponent implements OnInit {
  @Input()
  form: FormGroup;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => this.cdr.markForCheck());
  }

}
