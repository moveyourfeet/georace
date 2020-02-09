import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthnService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authnService: AuthnService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentToken = this.authnService.currentTokenValue;
        if (currentToken && currentToken.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentToken.token}`
                }
            });
        }

        return next.handle(request);
    }
}
