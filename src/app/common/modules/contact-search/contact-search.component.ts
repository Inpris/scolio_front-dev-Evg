import {Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Contact, ContactsService } from '../../services/contacts';
import { Company } from '@common/models/company';
import {Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {AccessesDataService} from "@common/services/accesses-data.service";
import {Subject} from "rxjs";

@Component({
  selector: 'sl-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.less'],
})
export class ContactSearchComponent implements OnInit, OnChanges, OnDestroy {
  searchForm: FormGroup;
  contacts: Contact[] = [];
  notFound = false;
  loadingContacts = false;

  private destroyed$ = new Subject();

  @Input()
  disabled: boolean;

  @Input()
  branchId: string;

  @Output()
  contact = new EventEmitter<Contact>();

  @Input()
  set initialContact(contact: Contact) {
    if (!contact) { return; }
    this.contacts = [contact];
    this.searchForm.patchValue({ contact });
  }

  private skipNextContactChange = false;

  constructor(private formBuilder: FormBuilder, private contactsService: ContactsService, private router: Router, private accessesDataService: AccessesDataService,) {
    this.searchForm = this.formBuilder.group({ contact: null, searchTerm: null });
  }

  ngOnInit() {
    this.onSearchTermChange();
    this.onContactChange();

    if (this.router.routerState.snapshot.url === '/shedule') {
      this.accessesDataService.addFormPatient
        .pipe(
          takeUntil(this.destroyed$)
        )
        .subscribe((value: any) => {
          if (value) {
            this.searchForm.get('contact').patchValue(value);
            this.accessesDataService.addFormPatient.next(null);
          }
        });
    }
  }

  ngOnChanges(changes: any): void {
    if (changes.branchId && !changes.branchId.firstChange) {
      this.reset();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  reset() {
    this.notFound = false;
    this.contacts = [];
    this.skipNextContactChange = true;
    this.searchForm.patchValue({ contact: null, searchTerm: null });
  }

  onSearch(searchTerm: string) {
    this.searchForm.patchValue({ searchTerm });
  }

  private onSearchTermChange() {
    this.searchForm.get('searchTerm').valueChanges
      .debounceTime(500)
      .do(() => { this.notFound = false; })
      .filter(value => value != null && value.length >= 3)
      .flatMap((searchTerm) => {
        this.contacts = [];
        this.loadingContacts = true;

        return this.contactsService.getList({ searchTerm, pageSize: 5 });
      })
      .map(response => response.data)
      .subscribe((contacts) => {
        this.loadingContacts = false;
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
