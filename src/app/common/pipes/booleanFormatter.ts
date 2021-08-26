import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanFormatter',
})
export class BooleanFormatterPipe implements PipeTransform {
  transform(data: boolean): string {
    return data ? 'Да' : 'Нет';
  }
}
