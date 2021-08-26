import { Directive, ElementRef, forwardRef, Host, HostListener, Input, OnInit, Optional, Renderer2, SkipSelf } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[slTemplateReplacement]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TemplateReplacementDirective),
      multi: true,
    },
  ],
})
export class TemplateReplacementDirective implements ControlValueAccessor, OnInit {
  private onChange;
  private isDisabled;
  private onTouched;
  private control: AbstractControl;
  @Input() slRegex;
  @Input() slReplace;
  @Input() formControlName: string;

  constructor(
    @Optional() @Host() @SkipSelf()
    protected controlContainer: ControlContainer,
    protected renderer: Renderer2,
    protected element: ElementRef) {
  }
  @HostListener('paste', ['$event.target.value'])
  @HostListener('input', ['$event.target.value'])
  input(value) {
    this.onChange(this.replace(value));
    this.onTouched();
    this.updateNativeValue(value);
  }

  ngOnInit() {
    if (this.formControlName && this.controlContainer) {
      this.control = this.controlContainer.control.get(this.formControlName);
    }
  }

  writeValue(value: any): void {
    this.updateNativeValue(value);
    if (value) {
      setTimeout(() => {
        const { pristine } = this.control || {} as AbstractControl;
        this.onChange(this.replace(value));
        // Restore pristine state in case of rewrite value
        if (this.control) {
          if (pristine) { this.control.markAsPristine(); }
        }
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateNativeValue(value) {
    const element = this.element.nativeElement;
    this.renderer.setProperty(element, 'value', this.replace(value));
  }

  replace(value) {
    if (typeof value !== 'string') { return value; }
    return value.replace(this.slRegex, this.slReplace);
  }

  setDisabledState(isDisabled) {
    const element = this.element.nativeElement;
    this.isDisabled = isDisabled;
    this.renderer.setProperty(element, 'disabled', isDisabled);
  }

}
