import { Component, forwardRef, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractPickerComponent } from './abstract-picker.component';
import { CandyDate } from './lib/candy-date';
import { PanelMode } from './standard-types';
import { FunctionProp } from 'ng-zorro-antd/src/core/types/common-wrap';
import { valueFunctionProp } from 'ng-zorro-antd/src/core/util/convert';
import { NzI18nService } from 'ng-zorro-antd';

@Component({
  selector: 'sl-month-picker',
  templateUrl: 'month-picker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => SlMonthPickerComponent),
  }],
})

export class SlMonthPickerComponent extends AbstractPickerComponent implements OnChanges {
  @Input() nzPlaceHolder: string;

  @Input() nzRenderExtraFooter: FunctionProp<TemplateRef<void> | string>;
  @Input() nzDefaultValue: CandyDate;
  @Input() nzFormat: string = 'yyyy-MM';

  panelMode: PanelMode = 'month';
  extraFooter: TemplateRef<void> | string;

  constructor(i18n: NzI18nService) {
    super(i18n);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.nzRenderExtraFooter) {
      this.extraFooter = valueFunctionProp(this.nzRenderExtraFooter);
    }
  }

  onPanelModeChange(mode: PanelMode): void {
    if (mode !== 'date') {
      this.panelMode = mode;
    }
  }

  onValueChange(value: CandyDate): void {
    super.onValueChange(value);

    this.closeOverlay();
  }

  onOpenChange(open: boolean): void {
    if (!open) {
      this.cleanUp();
    }
    this.nzOnOpenChange.emit(open);
  }

  // Restore some initial props to let open as new in next time
  private cleanUp(): void {
    this.panelMode = 'month';
  }
}
