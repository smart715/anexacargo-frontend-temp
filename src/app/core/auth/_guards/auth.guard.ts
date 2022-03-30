// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState} from '../../../core/reducers/';
import { isLoggedIn } from '../_selectors/auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(window.localStorage.getItem("userRole") == null){
      this.router.navigateByUrl('/auth/login');
      return false
    }
    return true;
    // return this.store
    //   .pipe(
    //     select(isLoggedIn),
    //     tap(loggedIn => {
    //       console.log(loggedIn);
    //       if(window.localStorage.getItem("userID") == null){
    //         this.router.navigateByUrl('/auth/login');
    //       }
    //       // if (!loggedIn) {
    //       //   this.router.navigateByUrl('/auth/login');
    //       // }
    //     })
    //   );
  }
}
