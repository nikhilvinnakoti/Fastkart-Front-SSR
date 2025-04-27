import { Component, inject, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User, UserAddress } from '../../../shared/interface/user.interface';
import { AccountState } from '../../../shared/state/account.state';
import { AccountService } from 'src/app/shared/services/account.service';
import { EditProfileModalComponent } from '../../../shared/components/widgets/modal/edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from '../../../shared/components/widgets/modal/change-password-modal/change-password-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency-symbol.pipe';
import { TitleCasePipe } from '../../../shared/pipe/title-case.pipe';
import { AsyncPipe } from '@angular/common';
import { AuthState } from 'src/app/shared/state/auth.state';
import { GetUserDetails } from 'src/app/shared/action/account.action';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    providers:[CurrencySymbolPipe],
    imports: [EditProfileModalComponent, ChangePasswordModalComponent, AsyncPipe, 
      TitleCasePipe, CurrencySymbolPipe, TranslateModule]
})
export class DashboardComponent {

  user$: Observable<User> = inject(Store).select(AccountState.user) as Observable<User>;
  isAuthenticated$: Observable<Boolean> = inject(Store).select(AuthState.isAuthenticated)

  @ViewChild("profileModal") ProfileModal: EditProfileModalComponent;
  @ViewChild("passwordModal") PasswordModal: ChangePasswordModalComponent;

  public address: UserAddress | null;
  userId$  = inject(Store).select(AuthState._id);
  public isLogin: boolean = false;

  constructor(private accountService: AccountService, private store: Store,) {
    // this.user$.subscribe(user => {
    //   if(user) {
    //     this.address = user?.address?.length ? user?.address?.[0] : null;
    //   }
    // });
    // this.userId$.subscribe(userId => {
    //   // if (!userId || isNaN(Number(userId))) {
    //   //   console.error('Invalid userId:', userId);
    //   //   return;
    //   // }
    //   console.log("userId", userId);
      
  
    //   this.store.dispatch(new GetUserDetails(userId));
    // });
  }

  // ngOnInit() {
    
  // }
  // ngOnInit() {
  //   this.isLogin = !!this.store.selectSnapshot(state => state.auth && state.auth.access_token)
  //   if(this.isLogin){
  //     this.userId$.subscribe(userId => {
  //       this.store.dispatch(new GetUserDetails(userId));
  //     });
  //   }
  // }

}
