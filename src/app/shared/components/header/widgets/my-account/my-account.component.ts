import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from '../../../../action/auth.action';
import { AccountUser } from '../../../../interface/account.interface';
import { AccountState } from '../../../../state/account.state';
import { AuthState } from '../../../../state/auth.state';
import { ConfirmationModalComponent } from '../../../widgets/modal/confirmation-modal/confirmation-modal.component';
import { RegisterModal } from 'src/app/shared/interface/auth.interface';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
    standalone: true,
    imports: [ RouterLink, ConfirmationModalComponent, AsyncPipe, TranslateModule]
})
export class MyAccountComponent {

  @Input() style: string = 'basic';

  isAuthenticated$: Observable<Boolean> = inject(Store).select(AuthState.isAuthenticated)
  user$: Observable<AccountUser> = inject(Store).select(AccountState.user) as Observable<AccountUser>;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
  registeredUserEmail$:Observable<RegisterModal["email"]>  = inject(Store).select(AuthState.email);
  constructor(private store: Store) {}
  ngOnInit() {
   this.isAuthenticated$.subscribe((res)=>console.log("res",res));
  }

  logout() {
    this.store.dispatch(new Logout());
  }

}
