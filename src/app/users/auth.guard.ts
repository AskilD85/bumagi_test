import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { HttpService } from './../services/http.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    @Inject(HttpService) private auth: HttpService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.auth.isLoggedIn()
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state)
  }
}
