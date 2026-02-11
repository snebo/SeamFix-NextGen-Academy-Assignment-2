import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { firstValueFrom, take } from 'rxjs';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('Auth', () => {
  let service: AuthService;
  const USER_EMAIL_KEY = 'userEmail';
  const USER_PASSWORD_KEY = 'userPassword';

  const mockRouter = {
    navigateByUrl: vi.fn(),
    navigate: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
    mockRouter.navigateByUrl.mockClear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts unauthenticated when there is no stored user', async () => {
    const auth = await firstValueFrom(service.isAuthenticated$.pipe(take(1)));
    expect(auth).toBeFalsy();
    expect(service.isLoggedIn()).toBeFalsy();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('starts authenticated when there is a stored user', async () => {
    localStorage.setItem(USER_EMAIL_KEY, 'a@b.com');
    
    // Re-initialize the service after setting localStorage for this specific test
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthService);

    const auth = await firstValueFrom(service.isAuthenticated$.pipe(take(1)));
    expect(auth).toBeTruthy();
    expect(service.isLoggedIn()).toBeTruthy();
    expect(service.getCurrentUser()).toBe('a@b.com');
  });

  it('login stores email and emits authenticated=true', () => {
    const emissions: boolean[] = [];
    const sub = service.isAuthenticated$.subscribe((v) => emissions.push(v));

    service.login('test@example.com', '1234567890');

    expect(localStorage.getItem(USER_EMAIL_KEY)).toBe('test@example.com');
    expect(localStorage.getItem(USER_PASSWORD_KEY)).toBe('1234567890');
    expect(service.isLoggedIn()).toBeTruthy();
    expect(service.getCurrentUser()).toBe('test@example.com');
    expect(emissions[emissions.length - 1]).toBeTruthy();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/products');

    sub.unsubscribe();
  });

  it('logout clears email and emits authenticated=false', () => {
    localStorage.setItem(USER_EMAIL_KEY, 'test@example.com');

    // Re-initialize the service after setting localStorage for this specific test
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthService);

    const emissions: boolean[] = [];
    const sub = service.isAuthenticated$.subscribe((v) => emissions.push(v));

    service.logOut();

    expect(localStorage.getItem(USER_EMAIL_KEY)).toBeNull();
    expect(service.isLoggedIn()).toBeFalsy();
    expect(service.getCurrentUser()).toBeNull();
    expect(emissions[emissions.length - 1]).toBeFalsy();

    sub.unsubscribe();
  });
});

