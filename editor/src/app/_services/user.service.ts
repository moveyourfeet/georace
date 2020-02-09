import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../_models';
import { AuthnService } from './authn.service';
import { map, switchMap, distinctUntilChanged, publishReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private authnService: AuthnService) {
    this.currentUser = authnService.currentToken.pipe(
      switchMap(token => this.http.get<User>('http://localhost:3000/v1/users/me'))
    );
  }

  public create(
    email: string,
    password: string,
    password_confirmation: string): Observable<User> {
    return this.http.post<User>(
      'http://localhost:3000/v1/users',
      { email, password, password_confirmation }).pipe();
  }

}
