import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {CurrentUser} from '../models/current-user';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (CurrentUser.instance.source) {
        return true;
      }
      this.router.navigate(['/anonymous'], { queryParams: { returnUrl: state.url }});
      return false;
    }
}
