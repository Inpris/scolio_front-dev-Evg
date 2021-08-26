import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd';
import { SelectSpecificationComponent } from '../select-specification/select-specification.component';
import { Specification } from '@common/models/specification';
import { SpecificationService } from '@common/services/specification.service';
import { PurchaseStore } from '@common/services/purchase.store';
import { Purchase } from '@common/models/purchase';
import { SpecificationCreate } from '@common/interfaces/Specification-create';
import { PageParams } from '@common/interfaces/Page-params';

@Component({
  selector: 'sl-product-specification',
  templateUrl: './product-specification.component.html',
  styleUrls: ['./product-specification.component.less'],
})
export class ProductSpecificationComponent implements OnInit, AfterViewInit {

  @Input()
  productId: string;
  specifications: Specification[] = null;
  purchaseData: Purchase;

  @ViewChild('tableSpecification')
  table;

  pageParams: PageParams = {
    page: 1,
    pageSize: 500,
    pageCount: null,
    totalCount: null,
  };

  constructor(
    private modalService: NzModalService,
    private specificationService: SpecificationService,
    private purchaseStore: PurchaseStore,
  ) {
  }

  ngOnInit() {
    this.getPurchase();
    this.getSpecificationList();
  }
  ngAfterViewInit() {
  }

  getPurchase() {
    this.purchaseStore.getState().subscribe((purchaseData: Purchase) => {
      this.purchaseData = purchaseData;
    });
  }

  private getSpecificationList() {
    const purchaseId = this.purchaseData.id;
    const productId = this.productId;
    this.specificationService.getList(purchaseId, productId, this.pageParams)
      .subscribe((response) => {
        this.specifications = response.data;
      }, (err) => {
        console.dir(err);
      });
  }

  removeDevice(specificationId, index) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить спецификацию?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.deleteSpecification(specificationId, index);
      },
      nzZIndex: 1200,
    });
  }

  public openModalDeviceForm(data?) {
    const isEditMode = !!data;
    const modalRef = this.modalService.create({
      // nzTitle: isEditMode ? 'Изменение данных спецификации' : 'Добавление новой спецификации',
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: SelectSpecificationComponent,
      nzComponentParams: {
        data,
        formType: isEditMode ? 'edit' : 'create',
      },
      nzFooter: null,
      nzWidth: '600px',
    });
    modalRef.afterClose
      .filter(newData => newData)
      .subscribe((newData) => {
        if (isEditMode) {
          this.updateSpecification(newData, data);
        } else {
          this.createSpecification(newData);
        }
      });
  }

  createSpecification(data: SpecificationCreate) {
    const purchaseId = this.purchaseData.id;
    const productId = this.productId;
    this.specificationService.create(purchaseId, productId, data)
      .subscribe((purchase) => {
        this.specifications.push(purchase);
        this.table.data = [...this.specifications];
      }, (err) => {
        console.dir(err);
      });
  }

  updateSpecification(newData: SpecificationCreate, oldData: Specification) {
    const purchaseId = this.purchaseData.id;
    const productId = this.productId;
    this.specificationService.update(purchaseId, productId, newData)
      .subscribe((purchase) => {
        Object.assign(oldData, purchase);
      }, (err) => {
        console.dir(err);
      });
  }

  deleteSpecification(specificationId, index) {
    const purchaseId = this.purchaseData.id;
    const productId = this.productId;
    this.specificationService.delete(purchaseId, productId, specificationId)
      .subscribe((purchase) => {
        this.table.data.splice(index, 1);
        this.specifications.splice(index, 1);
      }, (err) => {
        console.dir(err);
      });
  }
}
