import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JWToken } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthnService {
  private currentTokenSubject: BehaviorSubject<JWToken>;
  public currentToken: Observable<JWToken>;

  constructor(private http: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject<JWToken>(JSON.parse(localStorage.getItem('token')));
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public login(email: string, password: string): Observable<JWToken> {
    return this.http.post<JWToken>(
      `${environment.apiUrl}/auth/login`,
      { email, password }).pipe(
        map(token => {
          localStorage.setItem('token', JSON.stringify(token));
          this.currentTokenSubject.next(token);
          return token;
        })
      );
  }

  public get currentTokenValue(): JWToken {
    return this.currentTokenSubject.value;
  }

  public get authenticated(): boolean {
    const token = this.currentTokenValue;
    return !!(token && token.token);
  }

}
