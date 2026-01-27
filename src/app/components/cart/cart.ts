import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../service/product';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartItems = this.productService.getCart();
  }

  removeFromCart(product: Product) {
    this.productService.toggleCart(product);
    this.cartItems = this.productService.getCart();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  get cart(): Product[] {
    return this.productService.getCart();
  }
}
