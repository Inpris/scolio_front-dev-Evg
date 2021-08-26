import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sl-infinity-scroll',
  templateUrl: './infinity-scroll.component.html',
  styleUrls: ['./infinity-scroll.component.less'],
})
export class InfinityScrollComponent implements OnInit, OnDestroy {

  @Input()
  rootContainer;

  @Output()
  loadCallback = new EventEmitter();

  private scrollListener;
  private viewChanges$ = new Subject();

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  public checkView() {
    this.viewChanges$.next();
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    if (this.rootContainer) {
      this.scrollListener = this.renderer.listen(this.rootContainer, 'scroll', this.checkView.bind(this));
    }
    this.viewChanges$
      .debounceTime(150)
      .filter(this.isInViewPort.bind(this))
      .subscribe(() => this.loadCallback.emit());
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  isInViewPort() {
    const { top, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
    /* tslint:disable */
    const vHeight = (window.innerHeight || document.documentElement.clientHeight);
    return (
      (top > 0 || bottom > 0) &&
      top < vHeight
    );
    /* tslint:enable */
  }

}
