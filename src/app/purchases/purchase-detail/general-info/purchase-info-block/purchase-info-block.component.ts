import { Component } from '@angular/core';

@Component({
  selector: 'sl-purchase-info-block',
  templateUrl: './purchase-info-block.component.html',
  styleUrls: ['./purchase-info-block.component.less'],
})
export class PurchaseInfoBlockComponent {

  isEditMode = false;
  componentType: string = 'edit';
  constructor() { }

  onChangeMode(isEdit) {
    this.isEditMode = isEdit;
  }
}
