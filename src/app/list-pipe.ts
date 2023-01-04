import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toList'
})
export class ListPipe implements PipeTransform {

  transform(data: any): any[] {
    return data as any[];
  }

}