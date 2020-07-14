import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { of } from 'rxjs';
import { AuthnService } from './authn.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let router: Router;
  const mockAuthnService: Partial<AuthnService> = {
    get authenticated() { return false; }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        AuthGuardService,
        { provide: AuthnService, useValue: mockAuthnService },
      ],
    });
    service = TestBed.inject(AuthGuardService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should allow if authenticated', () => {
    spyOnProperty(mockAuthnService, 'authenticated', 'get').and.returnValue(true);
    const navigateSpy = spyOn(router, 'navigate');
    expect(service.canActivate()).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it ('should deny if not authenticated', () => {
    spyOnProperty(mockAuthnService, 'authenticated', 'get').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    expect(service.canActivate()).toBeFalse();
    expect(navigateSpy).toHaveBeenCalled();
  });
});
