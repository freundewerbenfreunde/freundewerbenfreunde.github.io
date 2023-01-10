import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { FacebookLoginProvider } from '@abacritt/angularx-social-login';


import { AppComponent as AppRootComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { JwtModule } from "@auth0/angular-jwt";

import { HomeComponent } from './components/home/home.component';
import { AppComponent } from './components/app/app.component';
import { AppDialogComponent } from './components/app-dialog/app-dialog.component';
import { OffersComponent } from './components/offers/offers.component';
import { OfferDialogComponent } from './components/offer-dialog/offer-dialog.component';
import { UserComponent } from './components/user/user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ImprintComponent } from './components/static/imprint.component';
import { TermsOfUseComponent } from './components/static/termsofuse.component';
import { PrivacyComponent } from './components/static/privacy.component';
import { AccountDeletionComponent } from './components/static/account-deletion.component';
import { ListPipe } from './list-pipe';
import { DatePipe } from './date-pipe';
import { DatetimePipe } from './datetime-pipe';
import { StatPipe } from './stat-pipe';

import { environment } from '../environments/environment';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

const cookieConfig: NgcCookieConsentConfig = {
  animateRevokable: false,
  cookie: {
    domain: environment.frontend,
    secure: true
  },
  layout: 'basic',
  law: {
    countryCode: 'DE',
    regionalLaw: false
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#2196f3'
    }
  },
  revokable: true,
  revokeBtn: '<div class="cc-revoke {{classes}}"><img src="assets/cookie_white.svg" height="24px" width="24px" role="button" onclick="this.parentNode.click()"/></div>',
  theme: 'block',
  type: 'opt-in'
};

@NgModule({
  declarations: [
    AppRootComponent,
    AppComponent,
    HomeComponent,
    AppComponent,
    AppDialogComponent,
    OffersComponent,
    OfferDialogComponent,
    ProfileComponent,
    UserComponent,
    ImprintComponent,
    TermsOfUseComponent,
    PrivacyComponent,
    AccountDeletionComponent,
    ListPipe,
    DatePipe,
    DatetimePipe,
    StatPipe
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    HttpClientModule,
    SocialLoginModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.backend],
        skipWhenExpired: true
      },
    }),
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    MatDatepickerModule,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookClientId, {
              scope: 'public_profile', locale: 'de_DE', fields: 'name,picture'
            })
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    {provide: 'googleTagManagerId',  useValue: environment.googleTagManagerId}
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
