import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() cartCount: number = 0;
  @Output() searchRequest = new EventEmitter<string>();

  constructor(private router: Router) {}

  auth = inject(AuthService);

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchRequest.emit(input.value);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToHome() {
    this.router.navigate(['/products']);
  }
}
