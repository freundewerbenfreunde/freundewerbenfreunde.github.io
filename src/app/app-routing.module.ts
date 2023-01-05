import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ImprintComponent } from './components/static/imprint.component';
import { PrivacyComponent } from './components/static/privacy.component';
import { TermsOfUseComponent } from './components/static/termsofuse.component';
import { OffersComponent } from './components/offers/offers.component';
import { UserComponent } from './components/user/user.component';
import { AccountDeletionComponent } from './components/static/account-deletion.component';

const routes: Routes = [
  { path: 'apps/:appKey', component: AppComponent },
  { path: 'users/:userKey', component: UserComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'termsofuse', component: TermsOfUseComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'account-deletion', component: AccountDeletionComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
