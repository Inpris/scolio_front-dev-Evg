import { Directive, ElementRef, forwardRef, Host, Optional, Renderer2, SkipSelf } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TemplateReplacementDirective } from '@common/directives/template-replacement.directive';

interface RegExpReplacement {
  regex: RegExp;
  replace: string;
}

@Directive({
  selector: '[slPhoneFormatter]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneFormatterDirective),
      multi: true,
    },
  ],
})
export class PhoneFormatterDirective extends TemplateReplacementDirective {
  private phoneFormatters: RegExpReplacement[] = [
    { regex: /[^\+\d]/g, replace: '' },
    { regex: /^8/, replace: '+7' },
    { regex: /^(\d)/, replace: '+$1' },
    { regex: /^\+\+/, replace: '+' },
    { regex: /(.+)\+$/g, replace: '$1' },
  ];

  constructor(
    @Optional() @Host() @SkipSelf()
    protected controlContainer: ControlContainer,
    protected renderer: Renderer2,
    protected element: ElementRef) {
    super(controlContainer, renderer, element);
  }

  replace(value) {
    if (typeof value !== 'string') { return value; }
    return this.phoneFormatters
      .reduce(
        (result, { regex, replace }) => result.replace(regex, replace),
        value,
      );
  }
}
