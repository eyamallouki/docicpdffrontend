// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserserviceService } from '../user-management/service/userservice.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserserviceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userService.getToken();
    console.log('Token:', token); // Log pour vérifier le token

    const excludedUrls = [
      '/auth/login/',
      '/auth/register/',
      '/auth/password-reset/',
      '/auth/password-reset-confirm/',
    ];

    const shouldExclude = excludedUrls.some(url => req.url.includes(url));

    if (token && !shouldExclude) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Headers:', cloned.headers); // Log pour vérifier les en-têtes
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
