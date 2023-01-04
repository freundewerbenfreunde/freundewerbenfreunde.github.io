import { Pipe, PipeTransform } from '@angular/core';
import { ObjectType } from 'deta/dist/types/types/basic';

@Pipe({
  name: 'getStat'
})
export class StatPipe implements PipeTransform {

  transform(obj: ObjectType, key: string): number {
    return (obj['stats'] as ObjectType)[key] as number;
  }

}