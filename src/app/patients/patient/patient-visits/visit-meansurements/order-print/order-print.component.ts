import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { VisitsService, Visit } from '@common/services/visits';
import { ProductOrderService } from '@common/services/product-order.service';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '@common/services/contacts';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import {UsersService} from '@common/services/users';

@Component({
  selector: 'sl-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderPrintComponent implements OnInit, OnDestroy, AfterViewChecked {
  public orderType;
  public visit;
  public contact;
  public device;
  private routeParamSub: any;
  public hasPrinted = false;
  public loading = false;
  public users: Map<string, string> = new Map();

  constructor(
    private visitService: VisitsService,
    private productOrderService: ProductOrderService,
    private route: ActivatedRoute,
    private contactService: ContactsService,
    private _usersService: UsersService,
    ) {}

  ngOnInit() {
    this.loading = true;

    if (this._usersService.users$.value) {
      const users = this._usersService.users$.value.data.map(user => ({ id: user.id, name: user.abbreviatedName }));
      const usersMap = new Map();

      users.forEach((user: { id: string, name: string }) => usersMap.set(user.id, user.name));
      this.users = usersMap;
    } else {
      this._usersService.getList({ pageSize: 1000 })
        .subscribe((response) => {
          const users = response.data.map(user => ({ id: user.id, name: user.abbreviatedName }));
          const usersMap = new Map();

          users.forEach((user: { id: string, name: string }) => usersMap.set(user.id, user.name));
          this.users = usersMap;
        });
    }

    this.routeParamSub = this.route.params.subscribe((params) => {
      const deviceId = params['deviceId'];
      const visitId = params['visitId'];
      const type = params['productOrderType'];
      switch (type.toLowerCase()) {
        case 'corset': this.orderType = ProductOrderTypes.CORSET; break;
        case 'swosh': this.orderType = ProductOrderTypes.SWOSH; break;
        case 'apparatus': this.orderType = ProductOrderTypes.APPARATUS; break;
        case 'prothesis-nk': this.orderType = ProductOrderTypes.PROTHESISNK; break;
        default: break;
      }

      if (deviceId && type) {
        if (type.toLowerCase() !== 'prothesis-nk') {
          this.productOrderService.get(this.orderType, deviceId)
            .subscribe((device) => {
              this.device = device;
              if (this.hasLoaded()) {
                this.loading = false;
              }
            });
        } else {
          this.productOrderService.getNk(deviceId)
            .subscribe((device) => {
              this.device = device;

              if (this.hasLoaded()) {
                this.loading = false;
              }
            });
        }
      }

      this.visitService.get(visitId)
        .subscribe((visit: Visit) => {
          this.visit = visit;
          this.contactService.getById(visit.contactId)
              .subscribe((contact) => {
                this.contact = contact;
                if (this.hasLoaded()) {
                  this.loading = false;
                }
              });
        });
    });
  }

  ngAfterViewChecked() {
    if (this.hasLoaded() && !this.hasPrinted) {
      window.print();
      this.hasPrinted = true;
      window.close();
    }
  }

  ngOnDestroy() {
    this.routeParamSub.unsubscribe();
  }

  private hasLoaded() {
    return this.device && this.visit && this.contact && Array.from(this.users.values()).length;
  }
}
