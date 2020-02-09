import { Component, OnInit } from '@angular/core';
import { AuthnService, UserService } from '../_services';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-authn',
  templateUrl: './authn.component.html',
  styleUrls: ['./authn.component.scss']
})
export class AuthnComponent implements OnInit {
  public email: Observable<string>;

  constructor(
    private authnService: AuthnService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.email = this.userService.currentUser.pipe(pluck('email'));
  }

  public get authenticated(): boolean {
    return this.authnService.authenticated;
  }
}
