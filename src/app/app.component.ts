import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { Observable } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from "@abacritt/angularx-social-login";
import { FWFService } from './services/fwf.service';
import { AbstractComponent } from './components/abstract/abstract.component';
import { OverlayContainer } from '@angular/cdk/overlay';

declare const FB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractComponent {

  isDarkTheme: Observable<boolean>;

  constructor(private overlayContainer: OverlayContainer,
    public translate: TranslateService, dateAdapter: DateAdapter<Moment>,
    private themeService: ThemeService,
    private authService: SocialAuthService, fwfService: FWFService) {
    super(fwfService);
    translate.addLangs(['de']);
    translate.setDefaultLang('de');
    translate.use('de');
    dateAdapter.setLocale('de');
    this.isDarkTheme = this.themeService.isDarkTheme;
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