import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  isPasswordVisible = false;
  isConfirmPasswordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  // Hàm kiểm tra confirmPassword có trùng với password không
  private passwordsMatch(): boolean {
    const password = this.form?.get('password')?.value;
    const confirmPassword = this.form?.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  // Ghi đè lại submit để kiểm tra trước khi gửi
  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch()) {
      this.form.get('confirmPassword')?.setErrors({ notMatch: true });
      alert('Password and confirm password do not match!');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.form.value).subscribe({
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

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
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
  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
