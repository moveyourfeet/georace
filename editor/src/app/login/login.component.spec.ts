import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthnService } from '../_services';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginSpy: jasmine.Spy;
  let snackBarSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginComponent,
        FormBuilder,
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        { provide: ActivatedRoute, useValue: {
          snapshot: {
            queryParams: {
              returnUrl: '/returnUrl'
            }
          }
        }},
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: AuthnService, useValue: jasmine.createSpyObj('AuthnService', ['login']) }
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = TestBed.inject(LoginComponent);
      component.ngOnInit();

      const authnService = fixture.debugElement.injector.get(AuthnService);
      loginSpy = authnService.login as jasmine.Spy;
      snackBarSpy = fixture.debugElement.injector.get(MatSnackBar).open as jasmine.Spy;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit if valid', () => {
    loginSpy.and.returnValue(of({token: 'some.JWT.token'}));

    updateForm('m@i.l', 'passw0rd');
    component.onSubmit();

    expect(loginSpy).toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should not submit if invalid email', () => {
    updateForm('invalid', 'passw0rd');
    component.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should not submit if no password', () => {
    updateForm('m@i.l', '');
    component.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should show error if login fails', () => {
    loginSpy.and.returnValue(throwError('Login failed'));
    snackBarSpy.and.callThrough();

    updateForm('m@i.l', 'password');
    component.onSubmit();

    expect(loginSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  function updateForm(email, password) {
    component.loginForm.controls.email.setValue(email);
    component.loginForm.controls.password.setValue(password);
    fixture.detectChanges();
  }
});
