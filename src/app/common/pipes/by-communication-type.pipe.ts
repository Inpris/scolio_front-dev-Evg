import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'byCommunicationType',
  pure: false,
})
export class ByCommunicationTypePipe implements PipeTransform {

  transform(contacts: FormControl[], communicationType: string) {
    return contacts.filter(contact => contact.value.communicationTypeId === communicationType);
  }

}
