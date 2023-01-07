import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObjectType } from 'deta/dist/types/types/basic';
import * as moment from 'moment';
import { FWFService } from 'src/app/services/fwf.service';

@Component({
  selector: 'app-offer-dialog',
  templateUrl: './offer-dialog.component.html',
  styleUrls: ['./offer-dialog.component.scss']
})
export class OfferDialogComponent {

  edit: boolean;
  appImg?: string;
  appName?: string;
  form: FormGroup;
  private offerKey?: string;
  private appKey?: string;

  constructor(private dialogRef: MatDialogRef<OfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fwfService: FWFService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      code: '',
      link: ['', [Validators.required, OfferDialogComponent.urlValidator]],
      expireAt: [null, [OfferDialogComponent.expirationValidator]]
    });
    this.edit = data.offerKey != undefined;
    if (data.appKey) {
      this.appKey = data.appKey;
      fwfService.getApp(data.appKey).subscribe(
        {
          next: (app: ObjectType) => {
            if (app['key'] != 'notfound') {
              this.appImg = app['img'] as string;
              this.appName = app['name'] as string;
            }
          }
        }
      );
    }
    if (data.offerKey) {
      this.offerKey = data.offerKey;
      fwfService.getOffer(data.offerKey).subscribe(
        {
          next: (offer: ObjectType) => {
            if (offer['key'] != 'notfound') {
              this.appKey = offer['app'] as string;
              this.appImg = offer['appImg'] as string;
              this.appName = offer['appName'] as string;
              this.form.patchValue({
                title: offer['title'],
                description: (offer['description'] as string[]).join('\r\n'),
                code: offer['code'],
                link: offer['link'],
                expireAt: moment(new Date(offer['expireAt'] as string))
              });
            }
          }
        }
      );
    }
  }

  private static urlValidator({ value }: AbstractControl): null | ValidationErrors {
    if (!value || value.length == 0 || !value.startsWith('https://')) {
      return { pattern: true };
    }
    try {
      new URL(value);
      return null;
    } catch {
      return { pattern: true };
    }
  }

  private static expirationValidator({ value }: AbstractControl): null | ValidationErrors {
    if (value && value.toDate() < new Date()) {
      return { pattern: true };
    }
    return null;
  }

  createOrUpdateOffer(): void {
    let offer: ObjectType = {};
    offer['app'] = this.appKey;
    offer['title'] = this.form.value.title;
    offer['description'] = this.form.value.description.split(/\r?\n/);
    if (this.form.value.code) {
      offer['code'] = this.form.value.code;
    }
    offer['link'] = this.form.value.link;
    if (this.form.value.expireAt) {
      offer['expireAt'] = this.form.value.expireAt.toDate();
    }
    if (this.offerKey) {
      this.fwfService.updateOffer(this.offerKey, offer).subscribe({
        next: () => {
          this.dialogRef.close();
        }
      });
    } else {
      this.fwfService.createOffer(offer).subscribe({
        next: () => {
          this.dialogRef.close();
        }
      });
    }
  }

}