import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { Contact } from '@common/models/contact';

@Component({
  selector: 'sl-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.less'],
})
export class CreatePatientComponent {
  @Input() formType: string;
  @Input() data: Contact;

  constructor(public modal: NzModalRef) {
  }

  actionCallback(action) {
    this.modal.destroy(action && action.data);
  }

  closeForm() {
    this.modal.destroy(null);
  }
}
