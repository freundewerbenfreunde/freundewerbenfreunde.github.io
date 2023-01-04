import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDate'
})
export class DatePipe implements PipeTransform {

  transform(data: any): string {
    return new Date(data).toLocaleDateString();
  }

}