import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserserviceService } from '../user-management/service/userservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserserviceService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.userService.getUserRole(); // Obtenir le rôle de l'utilisateur

    // Obtenir les rôles autorisés pour accéder à la route à partir des données de route
    const allowedRoles = (route.data as { roles: string[] }).roles; // Accéder à la propriété 'roles' avec ['roles']

    // Vérifier si l'utilisateur a le bon rôle pour accéder à la route
    if (allowedRoles && allowedRoles.includes(userRole)) {
      return true; // L'utilisateur a le bon rôle
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion si l'utilisateur n'a pas le bon rôle
      return false;
    }
  }
}

