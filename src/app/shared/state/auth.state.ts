import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from "@angular/router";
import { AccountClear, GetUserDetails } from "../action/account.action";
import {
  Register,
  Login,
  ForgotPassWord,
  VerifyEmailOtp,
  UpdatePassword,
  Logout,
  AuthClear,
  RefreshToken,
} from "../action/auth.action";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";
import { tap } from "rxjs";

export interface AuthStateModel {
  _id: String;
  token: String | Number;
  access_token: String | null;
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    _id:"",  
    token: "",
    access_token: ""
  },
})
@Injectable()
export class AuthState {
  constructor(
    private store: Store,
    public router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  // ngxsOnInit(ctx: StateContext<AuthStateModel>) {
  //   // Pre Fake Login (if you are using ap
  //   ctx.patchState({
  //     email: 'john.customer@example.com',
  //     token: '',
  //     access_token: '115|laravel_sanctum_mp1jyyMyKeE4qVsD1bKrnSycnmInkFXXIrxKv49w49d2a2c5'
  //   })
  // }

  @Selector()
  static accessToken(state: AuthStateModel): String | null {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): Boolean {
    return !!state.access_token;
  }
  @Selector()
  static _id(state: AuthStateModel): String {
    return state._id;
  }
  
  @Selector()
  static token(state: AuthStateModel): String | Number {
    return state.token;
  }
  

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    // Register Logic Here
    return this.authService.signUp(action.payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          _id: res?._id,
          token: res?.token,
          access_token: res?.access_token
        });
        // Redirect to home after signup
        this.router.navigate(["/theme/paris"]);
      })
      
    );
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    // Login Logic Here
    // this.store.dispatch(new GetUserDetails());
    // Register Logic Here
    return this.authService.login(action.payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          _id: res?._id,
          token: res?.token,
          access_token: res?.access_token
        });
        // Redirect to home after login
        this.router.navigate(["/theme/paris"]);
      })
      
    );
  }

  @Action(ForgotPassWord)
  forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassWord) {
    // Forgot Password Logic Here
  }

  @Action(VerifyEmailOtp)
  verifyEmail(ctx: StateContext<AuthStateModel>, action: VerifyEmailOtp) {
    // Verify Logic Here
  }

  @Action(UpdatePassword)
  updatePassword(ctx: StateContext<AuthStateModel>, action: UpdatePassword) {
    // Update Password Logic Here
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    return this.authService.logout().pipe(
      tap(() => {
        // Clear authentication state from the store
        ctx.setState({
          _id:'',
          token: '',
          access_token: null
        });

        // Optionally dispatch AuthClear action for other state cleanup
        ctx.dispatch(new AuthClear());

        // Redirect to login page after logout
        this.router.navigate(["/auth/login"]);
      })
    );
  }
  @Action(AuthClear)
  authClear(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      _id:"",
      token: "",
      access_token: null,
    });
    this.store.dispatch(new AccountClear());
  }

  // ✅ Refresh Access Token
  @Action(RefreshToken)
  refreshToken(ctx: StateContext<AuthStateModel>, action: RefreshToken) {
    ctx.patchState({ access_token: action.accessToken });
  }
}
