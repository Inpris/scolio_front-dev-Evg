import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sl-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.less'],
})
export class DictionaryComponent implements OnInit {
  public selectedTabIndex = 0;
  private tabsMap = ['branches'];

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

  public onTabChange(tabIndex: number): void {
    this.router.navigate(['/dictionary', this.tabsMap[tabIndex]]);
  }
}
