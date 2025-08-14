import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  isPasswordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Debug: Log form status changes
    this.form.statusChanges.subscribe((status) => {});
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();

      return;
    }
    console.log('form', this.form.value);
    this.isLoading = true;
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        console.log('Cehck response', response);
        this.isLoading = false;
        //  this.authService.saveToken(response.token);
        //  this.isLoading = false;
        //  this.error = '';
        //  this.router.navigate(['users']);
      },
      error: (error) => {
        console.log('Chefkc errror', error);
        this.isLoading = false;
      },
    });
  }
}
