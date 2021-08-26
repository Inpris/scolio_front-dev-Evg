import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'substr' })
export class SubstrPipe implements PipeTransform {
  transform(value: string, arg1: number = 0, arg2: number): any {
    if (!value) {
      return value;
    }
    return value.substr(arg1, arg2);
  }
}
