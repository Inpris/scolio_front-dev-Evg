import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

const LABEL_OFFSET = 24;
const SCROLL_CONTAINER = '.sl-root-layout .sl-root-container';
@Directive({ selector: '[slScrollToFirstInvalid]' })
export class ScrollToFirstInvalidDirective {
  @Input() slForm: NgForm;
  @Input() slOffset = LABEL_OFFSET;
  @Input() slScrollContainer = SCROLL_CONTAINER;
  elForm: ElementRef;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.elForm = elementRef.nativeElement;
  }

  @HostListener('purchaseCreateScroll', ['$event'])
  @HostListener('submit', ['$event'])
  onSubmit(event) {
    if (!this.slForm.valid) {
      setTimeout(() => {
        const elements = this.elForm['getElementsByClassName']('has-error');
        if (elements && elements.length) {
          const elem = elements[0];
          const body = document.querySelector(this.slScrollContainer);
          body.scrollTop = body.scrollTop + elem.getBoundingClientRect().top - this.slOffset;
        }
      }, 100);
    }
  }
}
