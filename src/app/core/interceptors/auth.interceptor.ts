import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { NotificationService } from '../../shared/services/notification.service';
import { Values } from '../../shared/interface/setting.interface';
import { GetSettingOption } from '../../shared/action/setting.action';
import { SettingState } from '../../shared/state/setting.state';
import { GetThemeOption } from '../../shared/action/theme-option.action';
import { GetCurrencies } from '../../shared/action/currency.action';
import { AuthClear, RefreshToken } from '../../shared/action/auth.action';
import { GetStates } from '../../shared/action/state.action';
import { GetCountries } from '../../shared/action/country.action';
import { AuthState } from 'src/app/shared/state/auth.state';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  setting$: Observable<Values> = inject(Store).select(SettingState.setting) as Observable<Values>;

  public isMaintenanceModeOn: boolean = false;

  constructor(private store: Store, private router: Router,
    private notificationService: NotificationService, private http: HttpClient, private authService: AuthService,) {
    this.store.dispatch(new GetCountries());
    this.store.dispatch(new GetStates());
    this.store.dispatch(new GetSettingOption());
    this.store.dispatch(new GetThemeOption());
    this.store.dispatch(new GetCurrencies({ status: 1 }));
    this.setting$.subscribe(setting => {
      this.isMaintenanceModeOn = setting?.maintenance?.maintenance_mode!
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {

    // If Maintainance Mode On
    if(this.isMaintenanceModeOn) {
      this.router.navigate(['/maintenance']);
    }

    const token = this.store.selectSnapshot(state => state.auth.access_token);
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
         // Unauthorized -> Refresh token
          return this.authService.refreshToken().pipe(
            switchMap((res: any) => {
              this.store.dispatch(new RefreshToken(res.access_token));

              // Retry original request with new token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access_token}` },
              });
              return next.handle(retryReq);
            }),
            catchError(() => {
              return throwError(() => new Error("Session expired, please log in again."));
            })
          );
        }
        return throwError(() => error);
      })
    );
    

  }
  
  
}
