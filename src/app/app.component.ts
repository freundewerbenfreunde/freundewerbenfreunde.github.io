import { Component, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { SocialAuthService, FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { FWFService } from './services/fwf.service';
import { AbstractComponent } from './components/abstract/abstract.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Router, Event, NavigationEnd } from '@angular/router';

declare const FB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractComponent implements OnDestroy {

  isDarkTheme: Observable<boolean>;
  private statusChangeSubscription: Subscription;
  private routerEventsSubscription?: Subscription;

  constructor(private overlayContainer: OverlayContainer,
    public translate: TranslateService, dateAdapter: DateAdapter<Moment>,
    private themeService: ThemeService,
    private authService: SocialAuthService,
    private router: Router,
    private gtmService: GoogleTagManagerService,
    fwfService: FWFService,
    ccService: NgcCookieConsentService) {
    super(fwfService);
    translate.addLangs(['de']);
    translate.setDefaultLang('de');
    translate.use('de');
    dateAdapter.setLocale('de');
    this.isDarkTheme = this.themeService.isDarkTheme;
    if (ccService.hasAnswered() && ccService.hasConsented()) {
      this.handleCookieAllowed();
    }
    this.statusChangeSubscription = ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        console.log(event);
        if (event.status == 'allow') {
          this.handleCookieAllowed();
        }
        else {
          this.handleCookieDenied();
        }
      });
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

  private handleCookieAllowed(): void {
    if (!this.routerEventsSubscription) {
      this.routerEventsSubscription = this.router.events.subscribe({
        next: (event: Event) => {
          if (event instanceof NavigationEnd) {
            this.gtmService.pushTag({});
          }
        }
      });
    }
  }

  private handleCookieDenied(): void {
    if (this.routerEventsSubscription) {
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
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

}