import { Component } from '@angular/core';
import { ObjectType } from 'deta/dist/types/types/basic';
import { FWFService } from 'src/app/services/fwf.service';
import { ResizeableComponent } from '../resizeable/resizeable.component';
import { MatDialog } from '@angular/material/dialog';
import { OfferDialogComponent } from '../offer-dialog/offer-dialog.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent extends ResizeableComponent {

  sortBy: string = 'appName';
  offers: ObjectType[] = [];

  constructor(fwfService: FWFService, private dialog: MatDialog) {
    super(fwfService);
  }

  protected override handleUser(user?: ObjectType): void {
    super.handleUser(user);
    this.refreshOffers();
  }

  sort(sortBy: string): void {
    if (sortBy != this.sortBy) {
      this.sortBy = sortBy;
    } else {
      this.sortBy = 'appName';
    }
    this.refreshOffers();
  }

  private refreshOffers(): void {
    if (!this.me) {
      return;
    }
    this.fwfService.getUserOffers(this.me['key'] as string, this.sortBy).subscribe(
      {
        next: (offers: ObjectType[]) => {
          this.offers = offers;
        }
      });
  }

  editOffer(offerKey: any): void {
    const dialogRef = this.dialog.open(OfferDialogComponent, {
      data: {
        offerKey: offerKey
      },
      minWidth: '320px',
      maxWidth: '600px',
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshOffers();
    });
  }

  deleteOffer(offerKey: any): void {
    this.fwfService.deleteOffer(offerKey).subscribe(
      {
        next: () => this.refreshOffers()
      }
    );
  }

  protected override getFactor(): number {
    return 180000;
  }

}