import { inject, Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import {
  UrlTree,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, of, switchMap, take } from "rxjs";
import { GetUserDetails } from "./../../shared/action/account.action";
import { AuthService } from "./../../shared/services/auth.service";
import { AuthState } from "src/app/shared/state/auth.state";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    console.log("Attempted URL:", state.url); // Debugging log

    // Check if the user is authenticated
    const accessToken = this.store.selectSnapshot(
      (state) => state.auth && state.auth.access_token
    );
    if (!accessToken) {
      this.authService.redirectUrl = state.url; // Store attempted URL for future redirection
      return this.router.createUrlTree(["/auth/login"]);
    }

    // Get userId from state synchronously
    const userId = this.store.selectSnapshot(AuthState._id);

    if (!userId) {
      return true; // If userId doesn't exist or userDetails already present, skip API call
    }

    // Dispatch GetUserDetails only if user details are not already available
    return this.store.dispatch(new GetUserDetails(userId)).pipe(
      take(1),
      switchMap(() => {
        return of(true);
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const accessToken = this.store.selectSnapshot(
      (state) => state.auth && state.auth.access_token
    );
    if (accessToken) {
      if (
        this.router.url.startsWith("/account") ||
        this.router.url === "/checkout" ||
        this.router.url === "/compare"
      ) {
        this.router.navigate(["/theme/paris"]);
      }
      return false;
    }
    return true;
  }
}
