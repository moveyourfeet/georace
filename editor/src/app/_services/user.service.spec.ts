import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AuthnService } from './authn.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  const mockAuthnService: Partial<AuthnService> = {
    currentToken: of({token: 'some.JWT.token'})
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        UserService,
        { provide: AuthnService, useValue: mockAuthnService },
      ],
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create user', () => {
    service.create('m@i.l', 'passw0rd', 'passw0rd').subscribe(
      data => expect(data.email).toEqual('m@i.l')
    );

    const req = httpTestingController.expectOne('http://localhost:3000/v1/users');
    expect(req.request.method).toEqual('POST');
    req.flush({
      id: 'de5d9442-273b-404a-aa64-aa59c2b164e4',
      created_at: '2020-02-08T16:34:19.437229Z',
      updated_at: '2020-02-08T16:34:19.437238Z',
      email: 'm@i.l',
    });
  });

  it('should handle create user failure', () => {
    service.create('m@i.l', 'passw0rd', 'password').subscribe(
      data => fail('no data expected'),
      error => expect(error.email[0]).toEqual('mail error')
    );

    const req = httpTestingController.expectOne('http://localhost:3000/v1/users');
    expect(req.request.method).toEqual('POST');
    req.flush(
      { errors: { email: ['mail error'] } },
      { status: 400, statusText: 'Bad Request' });
  });

  it('should get user', () => {
    service.currentUser.subscribe(
      data => expect(data.email).toEqual('m@i.l')
    );

    const req = httpTestingController.expectOne('http://localhost:3000/v1/users/me');
    expect(req.request.method).toEqual('GET');
    req.flush({
      id: 'de5d9442-273b-404a-aa64-aa59c2b164e4',
      created_at: '2020-02-08T16:34:19.437229Z',
      updated_at: '2020-02-08T16:34:19.437238Z',
      email: 'm@i.l',
    });
  });

});
