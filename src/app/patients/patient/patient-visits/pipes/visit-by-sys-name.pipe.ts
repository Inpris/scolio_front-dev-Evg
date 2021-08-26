import { Pipe, PipeTransform } from '@angular/core';
import { Visit } from '@common/models/visit';

@Pipe({
  name: 'visitBySysName',
})
export class VisitBySysNamePipe implements PipeTransform {

  transform(visits: Visit[], sysName) {
    return visits.filter(visit => visit.medicalService.sysName === sysName);
  }

}
