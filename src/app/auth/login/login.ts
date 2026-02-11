import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.value.email;
    const password = this.form.value.password;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products'; // Get returnUrl

    // i assert the variables here because the validator should flag else
    this.auth.login(email!, password!, returnUrl); // Pass returnUrl to login
  }
}
