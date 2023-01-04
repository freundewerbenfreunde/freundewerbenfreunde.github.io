import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ObjectType } from 'deta/dist/types/types/basic';
import { FWFService } from 'src/app/services/fwf.service';
import { ResizeableComponent } from '../resizeable/resizeable.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends ResizeableComponent {

  userKey: string;
  user?: ObjectType;
  offers: ObjectType[] = [];
  show?: string;
  sortBy: string = 'updated';

  constructor(el: ElementRef, router: Router, fwfService: FWFService) {
    super(el, fwfService);
    this.userKey = router.url.split('/')[2];
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.refreshUser();
    this.refreshOffers();
  }

  private refreshUser(): void {
    this.fwfService.getUser(this.userKey).subscribe(
      {
        next: (user: ObjectType) => {
          this.user = user;
        }
      });
  }

  private refreshOffers(): void {
    this.fwfService.getUserOffers(this.userKey, this.sortBy).subscribe(
      {
        next: (offers: ObjectType[]) => {
          this.offers = offers
        }
      });
  }

  sort(sortBy: string): void {
    if (sortBy != this.sortBy) {
      this.sortBy = sortBy;
    } else {
      this.sortBy = 'updated';
    }
    this.refreshOffers();
  }

  showOffer(offerKey: any): void {
    this.show = offerKey;
    this.fwfService.incrementViews(offerKey).subscribe(
      { next: () => this.refreshOffers() }
    );

  }

  hideOffer(): void {
    this.show = undefined;
  }

  toggleUserStat(statKey: string): void {
    if (this.me) {
      if (this.isStatOn('users', statKey, this.userKey)) {
        this.fwfService.removeUserStat(this.userKey, statKey).subscribe({
          next: () => {
            this.refreshUser();
            this.fwfService.refreshUser();
          }
        });
      }
      else {
        this.fwfService.addUserStat(this.userKey, statKey).subscribe({
          next: () => {
            this.refreshUser();
            this.fwfService.refreshUser();
          }
        });
      }
    }
  }

  toggleOfferStat(offerKey: any, statKey: string): void {
    if (this.me) {
      if (this.isStatOn('offers', statKey, offerKey)) {
        this.fwfService.removeOfferStat(offerKey, statKey).subscribe({
          next: () => {
            this.refreshOffers();
            this.fwfService.refreshUser();
          }
        });
      }
      else {
        this.fwfService.addOfferStat(offerKey, statKey).subscribe({
          next: () => {
            this.refreshOffers();
            this.fwfService.refreshUser();
          }
        });
      }
    }
  }

  getUserStats(): string[] {
    return this.getStats('users', this.userKey);
  }

  getOfferStats(offerKey: any): string[] {
    return this.getStats('offers', offerKey);
  }

  protected override getFactor(): number {
    return 240000;
  }

}
