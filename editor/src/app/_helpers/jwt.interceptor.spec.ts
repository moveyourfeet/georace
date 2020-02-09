import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthnService } from '../_services';

describe('JwtInterceptor', () => {
  const mockAuthnService = {
    currentTokenValue: { token: 'some.JWT.token' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthnService, useValue: mockAuthnService },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      ]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should add Authorization when token is set',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      mockAuthnService.currentTokenValue.token = 'some.JWT.token';
      http.get('/api').subscribe(response => expect(response).toBeTruthy());

      const req = httpMock.expectOne('/api');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer some.JWT.token');
      expect(req.request.method).toEqual('GET');

      req.flush({ data: 'test' });
    })
  );

  it('should not add Authorization when no token',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      mockAuthnService.currentTokenValue.token = null;
      http.get('/api').subscribe(response => expect(response).toBeTruthy());

      const req = httpMock.expectOne('/api');
      expect(req.request.headers.get('Authorization')).toBeNull();
      expect(req.request.method).toEqual('GET');

      req.flush({ data: 'test' });
    })
  );
});
