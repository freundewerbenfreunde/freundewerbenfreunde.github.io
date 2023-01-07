import { Component } from '@angular/core';
import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./static.component.scss']
})
export class PrivacyComponent {

  answered: boolean = false;
  consented: boolean = false;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;

  constructor(private ccService: NgcCookieConsentService) {
    this.answered = this.ccService.hasAnswered();
    this.consented = this.ccService.hasConsented();
    this.statusChangeSubscription = ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        if (event.status == 'allow') {
          this.handleCookieAllowed();
        }
        else {
          this.handleCookieDeny();
        }
      });
    this.revokeChoiceSubscription = ccService.revokeChoice$.subscribe(
      () => {
        this.handleCookieDeny();
      });
  }


  private handleCookieAllowed(): void {
    this.answered = true;
    this.consented = true;
  }

  private handleCookieDeny(): void {
    this.answered = true;
    this.consented = false;
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
  }
}
