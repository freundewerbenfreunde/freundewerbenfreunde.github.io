import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDatetime'
})
export class DatetimePipe implements PipeTransform {

  transform(data: any): string {
    return new Date(data).toLocaleString();
  }

}