import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthnService } from './authn.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('AuthnService', () => {
  let service: AuthnService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AuthnService ]
    });
    service = TestBed.inject(AuthnService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set token on successful login', () => {
    expect(service.currentTokenValue).toBeNull();
    expect(service.authenticated).toBeFalse();

    service.login('m@i.l', 'passw0rd').subscribe(
      data => expect(data.token).toEqual('some.JWT.token')
    );

    const req = httpTestingController.expectOne('http://localhost:3000/v1/auth/login');
    expect(req.request.method).toEqual('POST');
    req.flush({token: 'some.JWT.token'});

    expect(service.currentTokenValue.token).toEqual('some.JWT.token');
    expect(localStorage.getItem('token')).toEqual(JSON.stringify({token: 'some.JWT.token'}));

    expect(service.authenticated).toBeTrue();
  });

  it('should not set token if login fails', () => {
    expect(service.currentTokenValue).toBeNull();

    service.login('m@i.l', 'passw0rd').subscribe(
      data => fail('no data expected'),
      error => expect(error.error.error).toEqual('Login failed')
    );

    const req = httpTestingController.expectOne('http://localhost:3000/v1/auth/login');
    expect(req.request.method).toEqual('POST');
    req.flush(
      { error: 'Login failed' },
      { status: 401, statusText: 'Unauthorized' });

    expect(service.currentTokenValue).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
