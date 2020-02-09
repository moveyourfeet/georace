import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../_models';
import { AuthnService } from './authn.service';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private authnService: AuthnService) {
    this.currentUser = authnService.currentToken.pipe(
      switchMap(token => this.http.get<User>(`${environment.apiUrl}/users/me`))
    );
  }

  public create(
    email: string,
    password: string,
    password_confirmation: string): Observable<User> {
    return this.http.post<User>(
      `${environment.apiUrl}/users`,
      { email, password, password_confirmation }).pipe(
        catchError(err => throwError(err.error.errors))
      );
  }

}
