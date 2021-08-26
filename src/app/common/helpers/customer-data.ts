import { Injectable } from '@angular/core';
import { Customer } from '@common/models/customer';
import { CustomerService } from '@common/services/customer.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { CustomerUpdate } from '@common/interfaces/Customer-update';

@Injectable()
export class CustomerDataService {
  public data: Customer = {
    id: null,
    company: {
      address: null,
      city: {
        id: null,
        name: null,
      },
      id: null,
      name: null,
      region: {
        id: null,
        name: null,
      },
      inn: null,
    },
    director: {
      email: null,
      fullName: null,
      id: null,
      phone: null,
    },
    tenderDepartmentContact: {
      email: null,
      fullName: null,
      id: null,
      phone: null,
    },
    tsrDepartmentContact: {
      email: null,
      fullName: null,
      id: null,
      phone: null,
    },
    diffHours: null,
    comment: null,
    warningText: null,
    isStacionar: null,
    isDeleted: null,
    createdBy: {
      id: null,
      name: null,
    },
    createdDate: null,
    lastModifiedBy: {
      id: null,
      name: null,
    },
    lastModifiedDate: null,
  };

  constructor(private customerService: CustomerService) {
  }

  public getById(id: string) {
    return this.customerService.getById(id)
      .subscribe((response) => {
        Object.assign(this.data, response);
      }, (err) => {
        console.log(err);
      });
  }

  public update(id: string, data: CustomerUpdate) {
    return this.customerService.update(id, data)
      .do((response) => {
        Object.assign(this.data, response);
      });
  }

  public create(data: CustomerUpdate) {
    return this.customerService.create(data)
      .do((response) => {
        Object.assign(this.data, response);
      });
  }

}
