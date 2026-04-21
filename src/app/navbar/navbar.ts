import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';
import { CategoryService } from '../service/category';
import { Category } from '../models/category.model';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  @Input() cartCount: number = 0;
  @Output() searchRequest = new EventEmitter<string>();
  @Output() categoryRequest = new EventEmitter<string>();

  categories$: Observable<Category[]>;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categories$ = this.categoryService.getAllCategories().pipe(
      map((res: any) => Array.isArray(res) ? res : (res.data || []))
    );
  }

  auth = inject(AuthService);

  ngOnInit() {
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchRequest.emit(input.value);
  }

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.categoryRequest.emit(select.value);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToHome() {
    this.router.navigate(['/products']);
  }
}
