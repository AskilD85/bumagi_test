import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpService } from './../services/http.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private httpService: HttpService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      //  !  поставил пока...для тестов
      if (![401, 403].includes(err.status)) {
        // auto logout if 401 or 403 response returned from api
        console.log('this.httpService.logout();');

        // this.httpService.logout();
      }

      const error = err.error?.message || err.statusText;
      console.error(err);
      return throwError(error);
    }))
  }
}
