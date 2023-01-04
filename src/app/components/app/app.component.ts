import { Component, ElementRef } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { ObjectType } from 'deta/dist/types/types/basic';
import { FWFService } from 'src/app/services/fwf.service';
import { ResizeableComponent } from '../resizeable/resizeable.component';
import { MatDialog } from '@angular/material/dialog';
import { OfferDialogComponent } from '../offer-dialog/offer-dialog.component';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends ResizeableComponent {

  appKey: string;
  app?: ObjectType;
  offers: ObjectType[] = [];
  show?: string;
  sortBy: string = 'updated';

  constructor(el: ElementRef, router: Router, fwfService: FWFService, private dialog: MatDialog) {
    super(el, fwfService);
    this.appKey = router.url.split('/')[2];
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.refreshApp();
    this.refreshOffers();
  }

  private refreshApp(): void {
    this.fwfService.getApp(this.appKey).subscribe(
      {
        next: (app?: ObjectType) => {
          this.app = app;
        }
      });
  }

  private refreshOffers(): void {
    this.fwfService.getAppOffers(this.appKey, this.sortBy).subscribe(
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

  toggleAppStat(statKey: string): void {
    if (this.me) {
      if (this.isStatOn('apps', statKey, this.appKey)) {
        this.fwfService.removeAppStat(this.appKey, statKey).subscribe({
          next: () => {
            this.refreshApp();
            this.fwfService.refreshUser();
          }
        });
      }
      else {
        this.fwfService.addAppStat(this.appKey, statKey).subscribe({
          next: () => {
            this.refreshApp();
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

  getAppStats(): string[] {
    return this.getStats('apps', this.appKey);
  }

  getOfferStats(offerKey: any): string[] {
    return this.getStats('offers', offerKey);
  }

  hasOffer(): boolean {
    if (!this.me) {
      return true;
    }
    let offers = this.me['offers'] as string[];
    return offers.includes(this.me['key'] + '-' + this.appKey);
  }

  addOffer(appKey: any): void {
    const dialogRef = this.dialog.open(OfferDialogComponent, {
      data: {
        appKey: appKey
      },
      minWidth: '320px',
      maxWidth: '600px',
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshOffers();
    });
  }

  protected override getFactor(): number {
    return 240000;
  }

}
