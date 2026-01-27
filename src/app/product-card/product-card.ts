import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: Product;
  @Input() isSelected: boolean = false;
  @Output() addToCart = new EventEmitter<Product>();

  constructor(private router: Router) {}

  onAddToCart(event: Event) {
    event.stopPropagation(); // Prevent navigation when clicking add to cart
    this.addToCart.emit(this.product);
  }

  viewDetails() {
    // Navigate with category as query param
    this.router.navigate(['/products', this.product.id], {
      queryParams: { category: this.product.category }
    });
  }
}
