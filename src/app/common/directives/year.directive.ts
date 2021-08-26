import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[slYear]',
})
export class YearDirective {
  public position = 0;
  public reg = /^[0-9]+$/;

  constructor(public el: ElementRef, public renderer: Renderer2) {}

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement) {
    const element = this.el.nativeElement;

    if (this.reg.test(element.value)) {
      const val = element.value.slice(0, 4);

      this.renderer.setProperty(element, 'value', val);
      target.dataset.old = target.value;
    } else if (element.value !== '') {
      target.value = target.dataset.old || '';
    }

    if (element.value === '') {
      target.dataset.old = target.value;
    }
  }

}
