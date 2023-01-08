import { Component, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { FWFService } from './services/fwf.service';
import { AbstractComponent } from './components/abstract/abstract.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

declare const FB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractComponent implements OnDestroy {

  isDarkTheme: Observable<boolean>;
  private statusChangeSubscription: Subscription;
  private gtmEnabled: boolean = false;

  constructor(private overlayContainer: OverlayContainer,
    public translate: TranslateService, dateAdapter: DateAdapter<Moment>,
    private themeService: ThemeService,
    private gtmService: GoogleTagManagerService,
    fwfService: FWFService,
    private ccService: NgcCookieConsentService) {
    super(fwfService);
    translate.addLangs(['de']);
    translate.setDefaultLang('de');
    translate.use('de');
    dateAdapter.setLocale('de');
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.handleCookie();
    this.statusChangeSubscription = ccService.statusChange$.subscribe(
      () => this.handleCookie()
    );
    translate
      .get(['cookie.message', 'cookie.link', 'cookie.href', 'cookie.allow', 'cookie.deny', 'cookie.policy'])
      .subscribe(data => {
        ccService.getConfig().content = ccService.getConfig().content || {};
        ccService.getConfig().content!.message = data['cookie.message'];
        ccService.getConfig().content!.link = data['cookie.link'];
        ccService.getConfig().content!.href = data['cookie.href'];
        ccService.getConfig().content!.allow = data['cookie.allow'];
        ccService.getConfig().content!.deny = data['cookie.deny'];
        ccService.getConfig().content!.policy = data['cookie.policy'];
        ccService.destroy();
        ccService.init(ccService.getConfig());
      });
  }

  private handleCookie(): void {
    if (this.ccService.hasConsented() && !this.gtmEnabled) {
      this.gtmService.addGtmToDom().then(
        () => {
          this.gtmEnabled = true;
        });
    }
    if (!this.ccService.hasConsented() && this.gtmEnabled) {
      window.location.reload();
    }
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }

  setDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    if (checked) {
      overlayContainerClasses.add('dark-theme');
    } else {
      overlayContainerClasses.remove('dark-theme');
    }
  }

  signInWithFB(): void {
    this.fwfService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.fwfService.signOut();
  }

}