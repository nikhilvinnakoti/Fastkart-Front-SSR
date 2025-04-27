import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from '../../../../action/auth.action';
import { AccountUser } from '../../../../interface/account.interface';
import { AccountState } from '../../../../state/account.state';
import { AuthState } from '../../../../state/auth.state';
import { ConfirmationModalComponent } from '../../../widgets/modal/confirmation-modal/confirmation-modal.component';
import { RegisterModal } from 'src/app/shared/interface/auth.interface';
import { GetUserDetails } from 'src/app/shared/action/account.action';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
    standalone: true,
    imports: [ RouterLink, ConfirmationModalComponent, AsyncPipe, TranslateModule]
})
export class MyAccountComponent {

  @Input() style: string = 'basic';
  userId$  = inject(Store).select(AuthState._id);
  public isLogin: boolean = false;

  isAuthenticated$: Observable<Boolean> = inject(Store).select(AuthState.isAuthenticated)
  user$: Observable<AccountUser> = inject(Store).select(AccountState.user) as Observable<AccountUser>;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
  registeredUserId$  = inject(Store).select(AuthState._id);
  constructor(private store: Store,  private router: Router,) {}
  ngOnInit() {
  //  this.isLogin = !!this.store.selectSnapshot(state => state.auth && state.auth.access_token)
  //      if(this.isLogin){
  //        this.userId$.subscribe(userId => {
  //          this.store.dispatch(new GetUserDetails(userId));
  //        });
  //      }
  }

  logout() {
    this.store.dispatch(new Logout());
  }

}
