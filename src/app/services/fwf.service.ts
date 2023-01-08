import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ObjectType } from 'deta/dist/types/types/basic';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Injectable({
  providedIn: 'root'
})
export class FWFService {

  private baseUrl: string = 'https://' + environment.backend;
  private tokenKey = 'access_token';
  private helper = new JwtHelperService();
  private _user = new BehaviorSubject<ObjectType | undefined>(undefined);
  private userKey?: string;
  user$ = this._user.asObservable();

  constructor(private http: HttpClient, private authService: SocialAuthService,
    private ccSevice: NgcCookieConsentService,
    private gtmService: GoogleTagManagerService) {
    authService.authState.subscribe({
      next: (socialUser: SocialUser) => {
        if (socialUser == null) {
          this.userKey = undefined;
          localStorage.removeItem(this.tokenKey);
          this._user.next(undefined);
        } else {
          this.login(socialUser).subscribe(
            {
              next: (token: string | null) => {
                if (token == null) {
                  this.userKey = undefined;
                  localStorage.removeItem(this.tokenKey);
                  this._user.next(undefined);
                } else {
                  const user = this.helper.decodeToken(token);
                  this.userKey = user.key;
                  localStorage.setItem(this.tokenKey, token);
                  this._user.next(user);
                }
              }
            }
          );
        }
      }
    });
  }

  signIn(providerId: string ): void {
    if (this.ccSevice.hasConsented()) {
      this.gtmService.pushTag({ 'event': 'login' });
    }
    this.authService.signIn(providerId);
  }

  signOut(): void {
    if (this.ccSevice.hasConsented()) {
      this.gtmService.pushTag({ 'event': 'logout' });
    }
    this.authService.signOut();
  }

  private login(socialUser: SocialUser): Observable<string | null> {
    let user: ObjectType = {};
    user['provider'] = socialUser.provider;
    user['id'] = socialUser.id;
    user['name'] = socialUser.name;
    user['img'] = socialUser.photoUrl;
    return this.http.post(this.baseUrl + '/login',
      user,
      { observe: 'response', responseType: 'text' })
      .pipe(map(response => response.body));
  }

  refreshUser(): void {
    if (!this.userKey) {
      return;
    }
    this.getUser(this.userKey).subscribe(
      {
        next: (user: ObjectType) => {
          this._user.next(user);
        }
      }
    );
  }

  getAllCategories(): Observable<ObjectType[]> {
    return this.http.get<ObjectType[]>(this.baseUrl + '/categories');
  }

  getApps(search?: string, category?: string, sortBy?: string, source?: string): Observable<ObjectType[]> {
    if (this.ccSevice.hasConsented()) {
      if (search) {
        this.gtmService.pushTag({ 'event': 'search', 'searchTerm': search });
      }
      if (category) {
        this.gtmService.pushTag({ 'event': 'filter', 'criteria': category });
      }
    }
    let params = new HttpParams();
    if (search) {
      params = params.append('search', search);
    }
    if (category) {
      params = params.append('category', category);
    }
    if (sortBy) {
      params = params.append('sortBy', sortBy);
    }
    if (source) {
      params = params.append('source', source);
    }
    return this.http.get<ObjectType[]>(this.baseUrl + '/apps', { params: params });
  }

  getApp(appKey: string): Observable<ObjectType> {
    return this.http.get<ObjectType>(this.baseUrl + '/apps/' + appKey)
      .pipe(catchError((err: HttpErrorResponse) => {
        return of({ 'key': 'notfound' });
      }));
  }

  makeAppProposal(proposal: ObjectType): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    proposal['user'] = this.userKey;
    return this.http.post<void>(this.baseUrl + '/appproposals', proposal);
  }

  getAppOffers(appKey: string, sortBy: string): Observable<ObjectType[]> {
    let params = new HttpParams();
    params = params.append('sortBy', sortBy);
    return this.http.get<ObjectType[]>(this.baseUrl + '/apps/' + appKey + '/offers', { params: params });
  }

  addAppStat(appKey: string, statKey: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put<void>(this.baseUrl + '/apps/' + appKey + '/' + statKey + '/' + this.userKey, null);
  }

  removeAppStat(appKey: string, statKey: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.delete<void>(this.baseUrl + '/apps/' + appKey + '/' + statKey + '/' + this.userKey);
  }

  incrementViews(offerKey: string): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/offers/' + offerKey + '/views', null);
  }

  addOfferStat(offerKey: string, statKey: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put<void>(this.baseUrl + '/offers/' + offerKey + '/' + statKey + '/' + this.userKey,
      null);
  }

  removeOfferStat(offerKey: string, statKey: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.delete<void>(this.baseUrl + '/offers/' + offerKey + '/' + statKey + '/' + this.userKey);
  }

  addUserStat(userKey: string, statKey: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put<void>(this.baseUrl + '/users/' + userKey + '/' + statKey + '/' + this.userKey,
      null);
  }

  removeUserStat(userKey: string, statKey: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.delete<void>(this.baseUrl + '/users/' + userKey + '/' + statKey + '/' + this.userKey);
  }

  updateUser(user: ObjectType): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put<void>(this.baseUrl + '/users/' + this.userKey, user);
  }

  getUser(userKey: string): Observable<ObjectType> {
    return this.http.get<ObjectType>(this.baseUrl + '/users/' + userKey)
      .pipe(catchError((err: HttpErrorResponse) => {
        return of({ 'key': 'notfound' });
      }));
  }

  deleteUser(): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    if (this.ccSevice.hasConsented()) {
      this.gtmService.pushTag({ 'event': 'delete_account' });
    }
    return this.http.delete<void>(this.baseUrl + '/users/' + this.userKey).pipe(
      tap(_ => this.signOut())
    );
  }

  getUserOffers(userKey: string, sortBy: string): Observable<ObjectType[]> {
    let params = new HttpParams();
    params = params.append('sortBy', sortBy);
    return this.http.get<ObjectType[]>(this.baseUrl + '/users/' + userKey + '/offers',
      { params: params });
  }

  getOffer(offerKey: string): Observable<ObjectType> {
    return this.http.get<ObjectType>(this.baseUrl + '/offers/' + offerKey)
      .pipe(catchError((err: HttpErrorResponse) => {
        return of({ 'key': 'notfound' });
      }));
  }

  createOffer(offer: ObjectType): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    offer['user'] = this.userKey;
    return this.http.post<void>(this.baseUrl + '/offers',
      offer,
      { observe: 'response' })
      .pipe(map(response => {
        if (!response.ok) {
          return undefined;
        }
        else {
          return response.body!;
        }
      })
      );
  }

  updateOffer(offerKey: string, offer: ObjectType): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    offer['user'] = this.userKey;
    return this.http.put<void>(this.baseUrl + '/offers/' + offerKey, offer,
      { observe: 'response' })
      .pipe(map(response => {
        if (!response.ok) {
          return undefined;
        }
        else {
          return response.body!;
        }
      })
      );
  }

  deleteOffer(offerKey: any): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.delete<void>(this.baseUrl + '/offers/' + offerKey);
  }

}
