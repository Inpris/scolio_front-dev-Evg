import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sl-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less'],
})
export class ReportsComponent implements OnInit {

  selectedTabIndex = 0;
  private tabsMap = ['patients', 'visits'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (!params.tab) {
        this.onTabChange(this.selectedTabIndex);
        return;
      }
      const tabIndex = this.tabsMap.indexOf(params.tab);
      if (tabIndex >= 0) {
        this.selectedTabIndex = tabIndex;
      }
    });
  }

  onTabChange(tabIndex: number) {
    this.router.navigate(['/reports', this.tabsMap[tabIndex]]);
  }
}
