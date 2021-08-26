import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { NzModalRef } from 'ng-zorro-antd';
import { ProductService } from '@common/services/product.service';
import { Product } from '@common/models/product';
import { PurchaseStore } from '@common/services/purchase.store';
import { Purchase } from '@common/models/purchase';
import { PatientDeviceCreate } from '@common/interfaces/Patient-device-create';
import { PatientDevice } from '@common/models/patient-device';

@Component({
  selector: 'sl-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.less'],
})
export class SelectProductComponent implements OnInit {
  @Input() formType: string;
  @Input() data: PatientDevice;
  @Input() productsPatients: PatientDevice[];

  form: FormGroup;
  products: Product[];
  purchaseData: Purchase;
  selectedProduct: Product;
  maxReserved = 0;
  maxGiven = 0;
  maxInWork = 0;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private productService: ProductService,
    private purchaseStore: PurchaseStore,
  ) {
    this.form = this.formBuilder.group({
      purchaseDeviceId: [null, Validators.required],
      reserved: 0,
      given: 0,
      inWork: 0,
      comment: null,
    } as { [key: string]: any });

    this.form.get('purchaseDeviceId').valueChanges.subscribe((id) => {
      if (this.formType !== 'edit') {
        this.form.patchValue({
          reserved: 0,
        });
      }
      if (!this.products) { return; }
      this.selectedProduct = this.products.find(elem => elem.id === id);
      if (!this.selectedProduct) { return; }
      const reserved = this.form.get('reserved').value;
      this.maxReserved = (this.selectedProduct.avalible > 0 ? this.selectedProduct.avalible : 0) + (reserved ? reserved : 0);
    });

    this.form.get('reserved').valueChanges.subscribe((value) => {
      this.maxGiven = value;
      this.maxInWork = value;
    });

    this.form.get('inWork').valueChanges.subscribe((value) => {
      this.maxGiven = this.form.get('reserved').value - value;
    });

    this.form.get('given').valueChanges.subscribe((value) => {
      this.maxInWork = this.form.get('reserved').value - value;
    });
  }

  ngOnInit() {
    this.getPurchase();
  }

  fillForm() {
    const {
      purchaseDevice,
      reserved,
      comment,
      inWork,
      given,
    } = this.data;
    this.form.patchValue({
      reserved,
      comment,
      inWork,
      given,
      purchaseDeviceId: purchaseDevice.id,
    } as any);
  }

  getPurchase() {
    this.purchaseStore.getState().subscribe((purchaseData: Purchase) => {
      this.purchaseData = purchaseData;
      this.getProducts();
    });
  }

  getProducts() {
    const pageParam = {
      page: 1,
      pageSize: 500,
    };
    const purchaseId = this.purchaseData.id;
    this.productService.getList(purchaseId, {}, pageParam)
      .subscribe((response) => {
        response.data.map((item) => {
          if (this.productsPatients) {
            this.productsPatients.some((arr) => {
              if (arr.purchaseDevice.id === item.id) {
                item.disabled = true;
                return true;
              }
              return false;
            });
          }
          return item;
        });
        this.products = response.data;
        if (this.formType === 'edit') {
          this.fillForm();
        }
      });
  }

  getProductModel() {
    const {
      purchaseDeviceId,
      reserved,
      comment,
      given,
      inWork,
    } = this.form.value;
    return {
      purchaseDeviceId,
      given,
      inWork,
      reserved,
      comment,
    };
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }
    const data: PatientDeviceCreate = this.getProductModel();
    this.closeForm(data);
  }

  public closeForm(data?) {
    this.modal.destroy(data);
  }
}
