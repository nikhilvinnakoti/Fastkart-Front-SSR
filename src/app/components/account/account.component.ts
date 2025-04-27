import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoaderState } from '../../shared/state/loader.state';
import { Breadcrumb } from '../../shared/interface/breadcrumb';
import { GetNotification } from '../../shared/action/notification.action';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../shared/components/widgets/button/button.component';
import { LoaderComponent } from '../../shared/components/widgets/loader/loader.component';
import { AsyncPipe } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from '../../shared/components/widgets/breadcrumb/breadcrumb.component';
import { AuthState } from 'src/app/shared/state/auth.state';
import { GetUserDetails } from 'src/app/shared/action/account.action';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: true,
    imports: [BreadcrumbComponent, SidebarComponent, LoaderComponent, ButtonComponent, RouterOutlet, AsyncPipe, TranslateModule]
})
export class AccountComponent {

  loadingStatus$: Observable<boolean> = inject(Store).select(LoaderState.status) as Observable<boolean>;
    userId$  = inject(Store).select(AuthState._id);
    public isLogin: boolean = false;

  public open: boolean = false;
  public breadcrumb: Breadcrumb = {
    title: "Dashboard",
    items: [{ label: 'Dashboard', active: false }]
  };

  constructor(private store: Store) {
    // this.isLogin = !!this.store.selectSnapshot(state => state.auth && state.auth.access_token)
    //   if(this.isLogin){
    //     this.userId$.subscribe(userId => {
    //       this.store.dispatch(new GetUserDetails(userId));
    //     });
    //   }
    this.store.dispatch(new GetNotification());
  }
  // ngOnInit() {
      
  //   }

  openMenu(value: any){
    this.open = value;
  }

}
