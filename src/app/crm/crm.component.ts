import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sl-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.less'],
})
export class CrmComponent implements OnInit {

  selectedTabIndex = 0;
  private tabsMap = ['leads', 'tasks', 'mail', 'payments'];

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
    this.router.navigate(['/crm', this.tabsMap[tabIndex]]);
  }
}
