import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private oidcSecurityService: OidcSecurityService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkUser();
  }

  private checkUser(): Observable<boolean> | boolean {

    return this.oidcSecurityService.getIsAuthorized().pipe(
      tap((isAuthorized: boolean) => {
        console.log('AuthorizationGuard, canActivate isAuthorized: ' + isAuthorized);

        if (!isAuthorized) {
          this.router.navigate(['/unauthorized']);
        }
      })
    );
  }
}
