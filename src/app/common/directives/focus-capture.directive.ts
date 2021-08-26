import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[slFocusCapture]',
})
export class FocusCaptureDirective implements OnInit, OnDestroy {
  @Output() focused = new EventEmitter();
  @Output() blurred = new EventEmitter();
  private blurCapture = ($event) => { this.blurred.next($event); };
  private focusCapture = ($event) => { this.focused.next($event); };
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.elementRef.nativeElement.addEventListener('blur', this.blurCapture, true);
    this.elementRef.nativeElement.addEventListener('focus', this.focusCapture, true);
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('blur', this.blurCapture, true);
    this.elementRef.nativeElement.removeEventListener('focus', this.focusCapture, true);
  }
}
