import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { NzModalRef } from 'ng-zorro-antd';
import { Product } from '@common/models/product';
import { StringCustomValidators } from '@common/validators/string-custom-valid';
import { Entity } from '@common/interfaces/Entity';
import { extract } from '@common/utils/object';

@Component({
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.less'],
})
export class CreateProductComponent implements OnInit {
  @Input() formType: string;
  @Input() data: Product;
  @Input() productTypes: Entity[];

  form: FormGroup;
  countRound = (value) => {
    if (isNaN(value)) {
      return 0;
    }
    return Math.round(value);
  }

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
  ) {
    this.form = this.formBuilder.group({
      deviceType: [null, StringCustomValidators.required],
      name: [null, StringCustomValidators.required],
      count: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      description: [null, StringCustomValidators.required],
      note: [null],
    } as { [key: string]: any });
  }

  ngOnInit() {
    if (this.formType === 'edit') {
      const { name, count, description, price, note } = this.data;
      if (this.data.productType) {
        const deviceType = this.productTypes.find(value => value.id === this.data.productType.id);
        this.form.patchValue({ deviceType });
      }
      this.form.patchValue({ name, count, description, price, note } as any);
    }
  }

  private getProductModel() {
    const {
      deviceType,
      name,
      count,
      description,
      price,
      note,
    } = this.form.value;
    return {
      name,
      count,
      description,
      note,
      price,
      id: this.data && this.data.id ? this.data.id : null,
      productTypeId: extract(deviceType, 'id'),
    };
  }
  onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }
    const data = this.getProductModel();
    this.closeForm(data);
  }

  public closeForm(data?) {
    this.modal.destroy(data);
  }
}
