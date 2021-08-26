import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../models/contact';

@Component({
  selector: 'sl-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.less'],
})
export class ContactListComponent implements OnInit {
  @Input() contacts: Contact[];
  @Output() closeModal = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  applyContact(contactId) {
    this.closeModal.emit(contactId);
  }

  closeForm() {
    this.closeModal.emit(null);
  }
}
