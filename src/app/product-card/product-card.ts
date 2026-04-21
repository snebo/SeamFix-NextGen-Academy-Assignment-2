import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { StateService } from '../service/state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard implements OnInit {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  isSelected$!: Observable<boolean>;

  get categoryName(): string {
    if (!this.product.category) return 'Uncategorized';
    return typeof this.product.category === 'string' 
      ? this.product.category 
      : this.product.category.name;
  }

  constructor(
    private router: Router,
    private stateService: StateService
  ) {}

  ngOnInit() {
    this.isSelected$ = this.stateService.cart$.pipe(
      map(cart => this.product.id ? cart.some(p => p.id === this.product.id) : false)
    );
  }

  onAddToCart(event: Event) {
    event.stopPropagation(); // Prevent navigation when clicking add to cart
    this.addToCart.emit(this.product);
  }

  viewDetails() {
    if (!this.product.id) return;
    
    // Navigate with category as query param
    this.router.navigate(['/products', this.product.id], {
      queryParams: { category: this.product.category?.name || this.product.category }
    });
  }
}
