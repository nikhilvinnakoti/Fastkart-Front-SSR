import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext, NgxsUnhandledActionsLogger } from "@ngxs/store";
import { tap } from "rxjs";
import { GetUserDetails, UpdateUserProfile, UpdateUserPassword, 
         CreateAddress, UpdateAddress, DeleteAddress, AccountClear } from "../action/account.action";
import { AccountUser, AccountUserUpdatePassword } from "./../interface/account.interface";
import { AccountService } from "../services/account.service";
import { NotificationService } from "../services/notification.service";
import { Permission } from "../interface/role.interface";

export class AccountStateModel {
  user: AccountUser | null;
  permissions: Permission[];
}

@State<AccountStateModel>({
    name: "account",
    defaults: {
      user: null,
      permissions: []
    },
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService) {}
  

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }
  

  @Selector()
  static permissions(state: AccountStateModel) {
    return state.permissions;
  }

  @Action(GetUserDetails)
  getUserDetails(ctx: StateContext<AccountStateModel>, action: GetUserDetails) {
    return this.accountService.getUserDetails(action.userId).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            user: result,
            permissions: result?.permission,
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateUserProfile)
  updateProfile(ctx: StateContext<AccountStateModel>, { payload }: UpdateUserProfile) {
    // Update Profile Logic Here
  }

  @Action(UpdateUserPassword)
  updatePassword(ctx: StateContext<AccountUserUpdatePassword>, { payload }: UpdateUserPassword) {
    // Update Password Logic Here
  }

  @Action(CreateAddress)
  createAddress(ctx: StateContext<AccountStateModel>, action: CreateAddress) {
    // Create Address Logic Here
    return this.accountService.createAddress(action.payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        const updatedUser = {
          ...state.user, // Copy existing user data
          addresses: res, // Update addresses from response
          
        };
        ctx.setState({
          ...state,
          user: updatedUser
        });
        
      })
      
    );
  }

  // @Action(UpdateAddress)
  // updateAddress(ctx: StateContext<AccountStateModel>, action: UpdateAddress) {
  //   // Update Address Logic Here
  //   return this.accountService.updateAddress(action.payload).pipe(
  //     tap((res: any) => {
  //       const state = ctx.getState();
  //       const updatedUser = {
  //         ...state.user, // Copy existing user data
  //         addresses: res, // Update addresses from response
          
  //       };
  //       ctx.setState({
  //         ...state,
  //         user: updatedUser
  //       });
        
  //     })
      
  //   );
  // }
  @Action(UpdateAddress)
  updateAddress(ctx: StateContext<AccountStateModel>, action: UpdateAddress) {
    const { payload, _id } = action;
  
    return this.accountService.updateAddress(payload, _id).pipe(
      tap((updatedAddress: any) => {
        const state = ctx.getState();
  
        if (!state.user || !state.user.addresses) return;
  
        const updatedAddresses = state.user.addresses.map((addr: any) =>
          addr._id === updatedAddress._id ? updatedAddress : addr
        );
  
        const updatedUser = {
          ...state.user,
          addresses: updatedAddresses,
        };
  
        ctx.setState({
          ...state,
          user: updatedUser,
        });
      })
    );
  }
  



  @Action(DeleteAddress)
  deleteAddress(ctx: StateContext<AccountStateModel>, action: DeleteAddress) {
    // Delete Address Logic Here
  }

  @Action(AccountClear)
  accountClear(ctx: StateContext<AccountStateModel>){
    ctx.patchState({
      user: null,
      permissions: []
    });
  }

}