import { Component } from '@angular/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
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

  constructor(private ccService: NgcCookieConsentService) {
    this.handleCookie();
    this.statusChangeSubscription = ccService.statusChange$.subscribe(
      () => {
        this.handleCookie();
      });
  }


  private handleCookie(): void {
    this.answered = this.ccService.hasAnswered();
    this.consented = this.ccService.hasConsented();
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }
}
