import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { Navbar } from '../../navbar/navbar';
import { StateService } from '../../service/state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  cart$: Observable<Product[]>;
  cartCount$: Observable<number>;
  totalPrice$: Observable<number>;

  constructor(
    private stateService: StateService,
    private router: Router
  ) {
    this.cart$ = this.stateService.cart$;
    this.cartCount$ = this.cart$.pipe(map(cart => cart.length));
    this.totalPrice$ = this.cart$.pipe(
      map(cart => cart.reduce((total, item) => total + item.price, 0))
    );
  }

  removeFromCart(productId: number) {
    this.stateService.removeFromCart(productId);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}
