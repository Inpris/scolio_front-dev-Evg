import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-additional-info-block',
  templateUrl: './additional-info-block.component.html',
  styleUrls: ['./additional-info-block.component.less'],
})
export class AdditionalInfoBlockComponent {
  componentType: string = 'edit';
  isEditMode = false;

  constructor() { }

  onChangeMode(isEdit) {
    this.isEditMode = isEdit;
  }
}
