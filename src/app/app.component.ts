import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sl-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
}
