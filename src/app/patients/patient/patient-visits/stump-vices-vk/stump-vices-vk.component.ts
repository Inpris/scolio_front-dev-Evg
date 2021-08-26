import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { StumpVicesVkService } from '@common/services/dictionaries/stump-vices-vk.service';

@Component({
  selector: 'sl-stump-vices-vk',
  templateUrl: './stump-vices-vk.component.html',
  styleUrls: ['./stump-vices-vk.component.less'],
  providers: [
    ...FormValueAccessor.getAccessorProviders(StumpVicesVkComponent),
    StumpVicesVkService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StumpVicesVkComponent extends FormValueAccessor {
  public dictionary;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private stumpVicesVk: StumpVicesVkService,
  ) {
    super();
    this.form = fb.group({
      stumpVicesVk: [null],
    });
    this.stumpVicesVk.getList({})
      .map(response => response.data)
      .subscribe(data => this.dictionary = data);
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

}
