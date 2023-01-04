import { Component, OnInit } from '@angular/core';
import { ObjectType } from 'deta/dist/types/types/basic';
import { FWFService } from 'src/app/services/fwf.service';

@Component({
  template: ''
})
export abstract class AbstractComponent implements OnInit {

  me?: ObjectType;

  constructor(protected fwfService: FWFService) {
  }

  ngOnInit(): void {
    this.fwfService.user$.subscribe({
      next: (user?: ObjectType) => {
        this.handleUser(user);
      }
    });
  }

  protected handleUser(user?: ObjectType): void {
    this.me = user;
  }

  protected isStatOn(cat: string, statKey: string, statValue: string): boolean {
    if (!this.me) {
      throw Error();
    }
    let reactions = this.me['reactions'] as ObjectType;
    let stats = reactions[cat] as ObjectType;
    let statValues = stats[statKey] as string[];
    return statValues.includes(statValue);
  }

  protected getStats(cat: string, key: any): string[] {
    if (!this.me) {
      return [];
    }
    let reactions = this.me['reactions'] as ObjectType;
    let stats = reactions[cat] as ObjectType;
    let res: string[] = [];
    for (let statKey of Object.keys(stats)) {
      let statValues = stats[statKey] as string[];
      if (statValues.includes(key)) {
        res.push(statKey);
      }
    }
    return res;
  }

}
