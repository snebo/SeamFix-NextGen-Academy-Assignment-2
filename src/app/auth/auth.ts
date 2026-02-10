import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const USER_EMAIL_KEY = 'userEmail';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<boolean>(this.hasStoredUser());
  isAuthenticated$ = this.authStateSubject.asObservable();

  login(email: string): void {
    localStorage.setItem(USER_EMAIL_KEY, email);
    this.authStateSubject.next(true);
  }

  logOut(): void {
    localStorage.removeItem(USER_EMAIL_KEY);
    this.authStateSubject.next(false);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(USER_EMAIL_KEY);
  }

  isLoggedIn(): boolean {
    return this.hasStoredUser();
  }

  private hasStoredUser(): boolean {
    return !!this.getCurrentUser();
  }
}
