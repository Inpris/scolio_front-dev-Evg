import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Product } from '@common/models/product';
import { ProductService } from '@common/services/product.service';
import { Purchase } from '@common/models/purchase';
import { NzModalService } from 'ng-zorro-antd';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductCount } from '@common/interfaces/Product-count';
import { LayoutScrollService } from '@common/helpers/layout-scroll.service';
import { PageParams } from '@common/interfaces/Page-params';
import { ToastsService } from '@common/services/toasts.service';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types-by-medical.service';
import { Service } from '@common/models/service';

@Component({
  selector: 'sl-purchase-products-specification',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less'],
})

export class ProductsComponent implements OnInit {
  @ViewChild('table')
  table;

  @Input()
  purchase: Purchase;

  public dataLoading = true;
  public productTypes: Service[];

  sortMap = {
    name: null,
    count: null,
    price: null,
    totalAmount: null,
  };

  sortData = {
    sortBy: null,
    sortType: null,
  };

  data: Product[] = [];
  pageParams: PageParams = {
    page: 1,
    pageSize: 10,
    pageCount: null,
    totalCount: null,
  };

  scrollSubj;


  constructor(
    private productService: ProductService,
    private modalService: NzModalService,
    private messageService: ToastsService,
    private layoutScrollService: LayoutScrollService,
    private medicalServicesService: ProductTypesByMedicalService,
  ) {
    this.scrollSubj = this.layoutScrollService.getSubject();

    this.scrollSubj.subscribe((value) => {
      if (
        this.pageParams.pageCount === 0 ||
        this.pageParams.page === this.pageParams.pageCount ||
        this.dataLoading
      ) {
        return;
      }
      this.pageParams.page = this.pageParams.page + 1;
      const requestType = 'scroll';
      this.getProducts(requestType);
    });
  }

  ngOnInit() {
    this.getProducts();
    this.medicalServicesService.getProductTypes()
        .subscribe(services => this.productTypes = services);
  }

  private getProducts(requestType?) {
    this.dataLoading = true;
    const purchaseId = this.purchase.id;
    this.productService.getList(purchaseId, this.sortData, this.pageParams)
      .finally(() => this.dataLoading = false)
      .subscribe((data) => {
        if (requestType === 'scroll') {
          this.data = this.data.concat(data.data);
        } else {
          this.data = data.data;
        }

        const {
          page,
          pageSize,
          pageCount,
          totalCount,
        } = data;
        this.pageParams.page = page;
        this.pageParams.pageSize = pageSize;
        this.pageParams.pageCount = pageCount;
        this.pageParams.totalCount = totalCount;
      });
  }

  public createProductCountData(data) {
    const countProducts: ProductCount = {
      total: data.count,
      inWorked: data.totalInWork,
      done: data.totalGiven,
      notDone: data.count - data.totalInWork - data.totalGiven,
    };
    return countProducts;
  }

  expandChange(rowData, state) {
    this.table.data.forEach(data => data.expand = state && rowData.id === data.id);
  }

  sort(sortName, value) {
    this.clearSort();
    this.sortData.sortBy = sortName;
    this.sortData.sortType = value ? value.substr(0, value.length - 3) : null;
    this.resetPageParams();
    this.getProducts();
  }

  resetPageParams() {
    this.pageParams = {
      page: 1,
      pageSize: 10,
      pageCount: null,
      totalCount: null,
    };
  }
  clearSort() {
    Object.keys(this.sortData).map(key => this.sortData[key] = null);
    Object.keys(this.sortMap).map(key => this.sortMap[key] = null);
  }

  openModalDeviceForm(data?) {
    const isEditMode = !!data;
    const modalRef = this.modalService.create({
      // nzTitle: isEditMode ? 'Изменение данных изделия' : 'Добавление нового изделия',
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: CreateProductComponent,
      nzComponentParams: {
        data,
        formType: isEditMode ? 'edit' : 'create',
        productTypes: this.productTypes,
      },
      nzFooter: null,
      nzWidth: '600px',
    });
    modalRef.afterClose
      .filter(newData => newData)
      .subscribe((newData) => {
        if (isEditMode) {
          this.updateProduct(newData, data);
        } else {
          this.createProduct(newData);
        }
      });
  }

  createProduct(data) {
    const purchaseId = this.purchase.id;
    this.productService.create(purchaseId, data)
      .subscribe((purchase) => {
        this.table.data.unshift(purchase);
        this.pageParams.totalCount += 1;
      }, (err) => {
        this.messageService.onError(err);
      });
  }

  updateProduct(newData, oldData) {
    const purchaseId = this.purchase.id;
    this.productService.update(purchaseId, newData)
      .subscribe((purchase) => {
        Object.assign(oldData, purchase);
      }, (err) => {
        this.messageService.onError(err);
      });
  }

  deleteProduct(productId, index) {
    const purchaseId = this.purchase.id;
    this.productService.delete(purchaseId, productId)
      .subscribe((purchase) => {
        this.table.data.splice(index, 1);
        this.pageParams.totalCount -= 1;
        const message = 'Изделие успешно удалено';
        this.messageService.info(message, { nzDuration: 3000 });
      }, (err) => {
        const message = 'Возникла непредвиденная ошибка во время удаления изделия';
        this.messageService.error(message, { nzDuration: 3000 });
      });
  }

  removeDevice(id, index) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить изделие?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.deleteProduct(id, index);
      },
      nzZIndex: 1200,
    });
  }

  print() {
    window.print();
  }

  search() {

  }

  reset(array) {

  }
}
