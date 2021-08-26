import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'sl-additional-contacts',
  templateUrl: './additional-contacts.component.html',
  styleUrls: ['./additional-contacts.component.less'],
})
export class AdditionalContactsComponent {
  @Input()
  form;

  @Input()
  type;

  @Input()
  communicationType;

  names = ['Рабочий', 'Домашний', 'Другое'];

  removeContactRow(contact) {
    const controls = <FormArray>this.form.get('communications').controls;
    const contactIndex = Array.prototype.findIndex.call(controls, ct => ct === contact);
    (<FormArray>this.form.get('communications')).removeAt(contactIndex);
  }
}
