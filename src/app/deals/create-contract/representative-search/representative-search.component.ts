import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Contact } from '@common/models/contact';
import { ContactsService } from '@common/services/contacts';
import { PatientService } from '@common/services/patient.service';
import { PatientRepresentative } from '@common/models/patient-representative';

@Component({
  selector: 'sl-representative-search',
  templateUrl: './representative-search.component.html',
})
export class RepresentativeSearchComponent implements OnInit {
  searchForm: FormGroup;
  contacts: PatientRepresentative[] = [];
  notFound = false;

  @Input()
  patientId: string;

  @Input()
  disabled: boolean;

  @Output()
  contact = new EventEmitter<Contact>();

  private skipNextContactChange = false;

  constructor(
    private fb: FormBuilder,
    private contactsService: ContactsService,
    private patientService: PatientService,
  ) {
    this.searchForm = this.fb.group({
      contact: null,
      searchTerm: null,
    });
  }

  ngOnInit() {
    this.onSearchTermChange();
    this.onContactChange();
  }

  reset() {
    this.notFound = false;
    this.contacts = [];
    this.skipNextContactChange = true;
    this.searchForm.patchValue({ contact: null, searchTerm: null });
  }

  private onSearchTermChange() {
    this.patientService.getRepresentativesByPatient(this.patientId)
      .subscribe((contacts) => {
        this.notFound = contacts.length === 0;
        this.contacts = contacts;
      });
  }

  private onContactChange() {
    this.searchForm.get('contact').valueChanges.subscribe((contact: string | Contact) => {
      if (this.skipNextContactChange) {
        this.skipNextContactChange = false;
        return;
      }
      if (typeof contact === 'string') {
        this.skipNextContactChange = true;
        this.contact.emit(Contact.fromSearch(contact));
        this.searchForm.patchValue({ contact: null, searchTerm: null });
      } else if (contact == null) {
        this.contacts = [];
        this.contact.emit(null);
      } else {
        this.contact.emit(contact);
      }
    });
  }
}
