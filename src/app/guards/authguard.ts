import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserserviceService } from '../user-management/service/userservice.service';
import { Role } from '../model/usermodel';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserserviceService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = next.data['roles'] as string[];

    if (!expectedRoles || expectedRoles.length === 0) {
      console.error('Roles not defined for the route.');
      this.router.navigate(['/error']);
      return false;
    }

    const userRole = this.userService.getUserRole();
    if (!userRole || !expectedRoles.includes(userRole)) {
      // Redirect to the appropriate route based on the user's role
      if (userRole === Role.PATIENT) {
        this.router.navigate(['/patient-dashboard']);
      } else if (userRole === Role.ADMINISTRATEUR) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/error']);
      }
      return false;
    }
    return true;
  }
}