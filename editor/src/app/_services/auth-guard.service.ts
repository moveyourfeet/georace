import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthnService } from './authn.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthnService, private router: Router) { }

  canActivate(): boolean {
    if (!this.auth.authenticated) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
