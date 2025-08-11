import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  isPasswordVisible = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submit(): void {
    alert('dfasdf');
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    // TODO: Gọi service đăng nhập khi backend sẵn sàng
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  get emailInvalid(): boolean {
    const control = this.form.get('email');
    return !!control && control.touched && control.invalid;
  }

  get passwordInvalid(): boolean {
    const control = this.form.get('password');
    return !!control && control.touched && control.invalid;
  }
}
