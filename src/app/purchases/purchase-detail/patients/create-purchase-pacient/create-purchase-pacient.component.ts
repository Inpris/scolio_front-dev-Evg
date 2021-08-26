import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Contact } from '@common/models/contact';
import { Patient } from '@common/models/patient';

@Component({
  selector: 'sl-create-purchase-patient',
  templateUrl: './create-purchase-pacient.component.html',
  styleUrls: ['./create-purchase-pacient.component.less'],
})
export class CreatePurchasePacientComponent {
  @Input() formType: string;
  @Input() data: Patient | Contact;
  @Input() fromPurchase: boolean; // используем форму для закупки
  @Output() actionPurchaseCallback = new EventEmitter<any>();

  constructor() {}

  actionCallback(data) {
    this.actionPurchaseCallback.emit(data);
  }

  closeForm() {
    this.actionPurchaseCallback.emit(null);
  }
}
