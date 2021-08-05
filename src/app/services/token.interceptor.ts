import { Injectable, Inject, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {Router} from "@angular/router";
import 'rxjs/add/operator/do';
import {AuthService} from '../auth.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private auth: AuthService, private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const authService = this.injector.get(AuthService);
        request = request.clone({
          setHeaders: {
            Authorization: `${authService.getToken()}`
          }
        });
        return next.handle(request).do((event: HttpEvent<any>) => {}, (err: any) => {
            if (err.status === 401) {
                window.alert('Your Token  has been Expired! Please Log in Again.');
                localStorage.clear();
                this.router.navigate(['/auth']);
                return;
            }
        });
      }
    }