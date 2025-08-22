import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Debug: Log form status changes
    // this.form.statusChanges.subscribe((status) => {});
    if (this.authService.getToken()) {
      const credential = this.authService.getCredential();
      if (credential.role === 'ADMIN') {
        this.router.navigate(['admin', 'people']);
      } else {
        this.router.navigate(['']);
      }
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();

      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        const credential = response.data.infoResponse;
        this.authService.setCredential(credential);
        this.authService.saveToken(response.data.accessToken);
        this.isLoading = false;
        if (credential.role === 'ADMIN') {
          this.router.navigate(['admin', 'people']);
        } else {
          this.router.navigate(['']);
        }
      },
      error: (error) => {
        console.log('Chefkc errror', error);
        this.isLoading = false;
      },
    });
  }
}
