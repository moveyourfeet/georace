import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthnComponent } from './authn.component';
import { of } from 'rxjs';
import { AuthnService, UserService } from '../_services';
import { User } from '../_models';

describe('AuthnComponent', () => {
  let component: AuthnComponent;
  let fixture: ComponentFixture<AuthnComponent>;

  beforeEach(async(() => {
    const mockAuthnService: Partial<AuthnService> = {
      get authenticated() { return false; }
    };
    const mockUserService: Partial<UserService> = {
      currentUser: of({email: 'm@i.l'} as User)
    };

    TestBed.configureTestingModule({
      declarations: [
        AuthnComponent
      ],
      providers: [
        { provide: AuthnService, useValue: mockAuthnService },
        { provide: UserService, useValue: mockUserService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login button when not authenticated', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a').textContent).toContain('Log ind');
  });

  it('should not show login button when authenticated', () => {
    const authnService = fixture.debugElement.injector.get(AuthnService);
    const spy = spyOnProperty(authnService, 'authenticated', 'get').and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a')).toBeNull();
    expect(spy).toHaveBeenCalled();
  });

  it('should show user e-mail when authenticated', () => {
    const authnService = fixture.debugElement.injector.get(AuthnService);
    const spy = spyOnProperty(authnService, 'authenticated', 'get').and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('span').textContent).toContain('m@i.l');
    expect(spy).toHaveBeenCalled();
  });
});
