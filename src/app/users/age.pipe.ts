import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const dob = new Date(value);
    const milliSeconds = Date.now() - dob.getTime();
    const year = new Date(milliSeconds).getFullYear();
    return year - 1970;
  }

}
