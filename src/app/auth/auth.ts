import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}`;

  private authStateSubject = new BehaviorSubject<boolean>(this.hasStoredUser());
  isAuthenticated$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string, redirectUrl?: string) {
    return this.http.post<LoginResponse>(`${this.API}/login`, { email, password }).pipe(
      tap(({ access_token }) => {
        const user = { email: email };
        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.authStateSubject.next(true);
        this.router.navigateByUrl(redirectUrl || '/products');
        console.log('user: ', JSON.stringify(user), 'token: ', access_token);
      }),
    );
  }

  logOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.authStateSubject.next(false);
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return this.hasStoredUser();
  }

  private hasStoredUser(): boolean {
    return !!this.getToken();
  }
}
