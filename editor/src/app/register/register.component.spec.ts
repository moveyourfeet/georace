import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthnService, UserService } from '../_services';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerSpy: jasmine.Spy;
  let snackBarSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent
      ],
      providers: [
        RegisterComponent,
        FormBuilder,
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: AuthnService, useValue: jasmine.createSpyObj('AuthnService', [], ['authenticated']) },
        { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['create']) },
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(RegisterComponent);
      component = TestBed.inject(RegisterComponent);
      component.ngOnInit();

      registerSpy = fixture.debugElement.injector.get(UserService).create as jasmine.Spy;
      snackBarSpy = fixture.debugElement.injector.get(MatSnackBar).open as jasmine.Spy;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit if valid', () => {
    registerSpy.and.returnValue(of({ email: 'm@i.l'}));

    updateForm('m@i.l', 'passw0rd', 'passw0rd');
    component.onSubmit();

    expectValidity(true, true, true);

    expect(registerSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('should not submit if invalid email', () => {
    updateForm('invalid', 'passw0rd', 'passw0rd');
    component.onSubmit();

    expectValidity(false, true, true);

    expect(registerSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should not submit if no password', () => {
    updateForm('m@i.l', '', 'passw0rd');
    component.onSubmit();

    expectValidity(true, false, true);

    expect(registerSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should not submit if no password confirmation', () => {
    updateForm('m@i.l', 'passw0rd', '');
    component.onSubmit();

    expectValidity(true, true, false);

    expect(registerSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should show error if register with email error', () => {
    registerSpy.and.returnValue(throwError({ email: ['Taken']}));

    updateForm('m@i.l', 'passw0rd', 'passw0rd');
    component.onSubmit();

    expectValidity(false, true, true);

    expect(registerSpy).toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should show error if register with password error', () => {
    registerSpy.and.returnValue(throwError({ password: ['Too short']}));

    updateForm('m@i.l', 'p', 'p');
    component.onSubmit();

    expectValidity(true, false, true);

    expect(registerSpy).toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should show error if register with password confirmation error', () => {
    registerSpy.and.returnValue(throwError({ password_confirmation: ['Do not match']}));

    updateForm('m@i.l', 'password', 'passw0rd');
    component.onSubmit();

    expectValidity(true, true, false);

    expect(registerSpy).toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  function updateForm(email: string, password: string, passwordConfirm: string) {
    component.registerForm.controls.email.setValue(email);
    component.registerForm.controls.password.setValue(password);
    component.registerForm.controls.password_confirmation.setValue(passwordConfirm);
    fixture.detectChanges();
  }

  function expectValidity(email: boolean, password: boolean, passwordConfirm: boolean) {
    fixture.detectChanges();
    expect(component.registerForm.controls.email.valid).toBe(email);
    expect(component.registerForm.controls.password.valid).toBe(password);
    expect(component.registerForm.controls.password_confirmation.valid).toBe(passwordConfirm);
  }
});
