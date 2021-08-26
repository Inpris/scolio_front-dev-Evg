import { Injectable } from '@angular/core';
import { Contact } from '@common/models/contact';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ContactsService } from '@common/services/contacts';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactResolverService implements Resolve<Contact> {

  constructor(private contactService: ContactsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contact> {
    return this.contactService.getById(route.params.id);
  }

}
