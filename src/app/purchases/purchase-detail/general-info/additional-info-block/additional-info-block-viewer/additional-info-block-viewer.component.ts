import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Customer } from '@common/models/customer';
import { CustomerDataService } from '@common/helpers/customer-data';
import * as moment from 'moment';

@Component({
  selector: 'sl-additional-info-block-viewer',
  templateUrl: './additional-info-block-viewer.component.html',
  styleUrls: ['./additional-info-block-viewer.component.less'],
})
export class AdditionalInfoBlockViewerComponent implements OnInit, OnDestroy {

  customerData: Customer;
  private clockTimer;
  public customerDateTime;
  @Output() changeMode = new EventEmitter();

  constructor(private customerDataService: CustomerDataService) {
  }

  ngOnInit() {
    this.customerData = this.customerDataService.data;
    this.customerDateTime = this.getCustomerDateTime();
    this.clockTimer = setInterval(() => {
      this.customerDateTime = this.getCustomerDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.clockTimer);
  }

  toEditMode() {
    this.changeMode.emit(true);
  }

  private getCustomerDateTime() {
    return moment().utc().utcOffset(3 + this.customerData.diffHours).format('DD.MM.YYYY HH:mm');
  }
}
