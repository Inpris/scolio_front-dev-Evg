import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Location } from '@angular/common';
import { Purchase } from '@common/models/purchase';
import { PurchaseService } from '@common/services/purchase.service';
import { PurchaseStore } from '@common/services/purchase.store';
import { CustomerDataService } from '@common/helpers/customer-data';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';
import { Customer } from '@common/models/customer';
import { PurchaseTabService } from '@common/services/purchase-tab';
import { ISubscription } from 'rxjs/Subscription';
import { ToastsService } from '@common/services/toasts.service';

@Component({
  selector: 'sl-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.less'],
})
export class PurchaseDetailComponent implements OnInit, OnDestroy {

  purchaseData: Purchase;
  selectedTabIndex = 0;
  private tabsMap = ['general-info', 'products-specification', 'patients'];
  isLoading = false;
  private unsubscriber = new Subject();
  private purchaseId: string;
  statusColors;
  customerData: Customer;
  subject: Subject<number>;
  private locationSub: ISubscription;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
    private purchaseStore: PurchaseStore,
    private customerDataService: CustomerDataService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private purchaseStatusesService: PurchaseStatusesService,
    private purchaseTabService: PurchaseTabService,
    public toastsService: ToastsService,
  ) {
    this.customerData = this.customerDataService.data;
    this.subject = this.purchaseTabService.getSubject();
    this.statusColors = this.purchaseStatusesService.getColors();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params.purchaseId) {
        this.purchaseId = params.purchaseId;
        this.loadPurchase(params.purchaseId);
      }
      if (!params.tab) {
        this.onTabChange(this.selectedTabIndex);
        return;
      }
      const tabIndex = this.tabsMap.indexOf(params.tab);
      if (tabIndex >= 0) {
        this.selectedTabIndex = tabIndex;
      }
    });
    this.subject.subscribe((index) => { this.selectedTabIndex = index; });

    // fix press browser button back and next
    this.locationSub = this.location
    .subscribe((x) => {
      const path = x.url.split('/').pop();
      const tabIndex = this.tabsMap.indexOf(path);
      if (tabIndex >= 0) {
        if (this.selectedTabIndex !== tabIndex) {
          this.selectedTabIndex = tabIndex;
        } else {
          // fix transition identical state
          window.history.back();
        }
      }
    });
  }

  removePurchase() {
    this.purchaseService.delete(this.purchaseId).subscribe((response) => {
      this.message.info('Закупка удалена.', { nzDuration: 3000 });
      this.router.navigate(['/purchases']);
    });
  }

  confirmRemove() {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить закупку?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => { this.removePurchase(); },
      nzZIndex: 1200,
    });
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.locationSub.unsubscribe();
  }

  setActiveTab(index: number) {
    this.selectedTabIndex = index;
  }

  onTabChange(tabIndex: number) {
    const componentUrl = this
      .router
      .createUrlTree(
        [this.tabsMap[tabIndex]],
        { relativeTo: this.activatedRoute.parent },
      )
      .toString();

    this.location.go(componentUrl);
    this.selectedTabIndex = tabIndex;
  }

  loadPurchase(purchaseId: string) {
    this.isLoading = true;
    this.purchaseService.getPurchaseById(purchaseId)
      .subscribe((purchase: Purchase) => {
        this.purchaseData = purchase;
        this.purchaseStore.setState(purchase);
        this.isLoading = false;
        this.getCustomerData();
      });
  }

  getCustomerData() {
    if (!this.purchaseData.customer) { return; }
    const customerId = this.purchaseData.customer.id;
    this.customerDataService.getById(customerId);
  }

}
