import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '@common/utils/date';

@Pipe({ name: 'age' })
export class AgePipe implements PipeTransform {
  transform(birthDate) {
    return DateUtils.age(birthDate);
  }
}
