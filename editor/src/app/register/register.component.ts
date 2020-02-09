import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, AuthnService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private authnService: AuthnService,
    private userService: UserService,
  ) {
    if (this.authnService.currentTokenValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.userService.create(
      this.f.email.value,
      this.f.password.value,
      this.f.password_confirmation.value).pipe(first()).subscribe(
        data => {
          this.openSnackBar(`Bruger oprettet ${data.email}`);
          this.router.navigate(['login']);
        },
        error => {
          this.openSnackBar(JSON.stringify(error.error.errors));
        }
      );
  }

  private openSnackBar(message: string) {
    this.snackBar.dismiss();
    this.snackBar.open(message, null, {
      duration: 5000, // seconds
    });
  }
}
