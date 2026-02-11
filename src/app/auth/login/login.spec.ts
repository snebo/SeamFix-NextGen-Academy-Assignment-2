import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { of } from 'rxjs';
import { vi } from 'vitest';

class MockAuthService {
  isAuthenticated$ = of(false);
  login = vi.fn();
  logOut = vi.fn();
  isLoggedIn = vi.fn(() => false);
  getCurrentUser = vi.fn(() => null);
}

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid initially', () => {
    expect(component.form.invalid).toBeTruthy();
  });

  it('email field should be required', () => {
    const email = component.form.controls['email'];
    email.setValue('');
    expect(email.errors?.['required']).toBeTruthy();
  });

  it('email field should require a valid email format', () => {
    const email = component.form.controls['email'];
    email.setValue('invalid-email');
    expect(email.errors?.['email']).toBeTruthy();
  });

  it('password field should be required', () => {
    const password = component.form.controls['password'];
    password.setValue('');
    expect(password.errors?.['required']).toBeTruthy();
  });

  it('password field should require a minimum length of 6', () => {
    const password = component.form.controls['password'];
    password.setValue('12345');
    expect(password.errors?.['minlength']).toBeTruthy();
  });

  it('submit should not call authService.login if form is invalid', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('12345'); // Invalid password
    component.submit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('submit should call authService.login if form is valid', () => {
    const email = 'test@example.com';
    const password = 'validPassword123';
    component.form.controls['email'].setValue(email);
    component.form.controls['password'].setValue(password);
    component.submit();
    expect(mockAuthService.login).toHaveBeenCalledWith(email, password);
  });
  it('submit() marks all fields as touched when invalid', () => {
    // start invalid by default
    component.submit();

    expect(component.form.get('email')!.touched).toBeTruthy();
    expect(component.form.get('password')!.touched).toBeTruthy();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});
