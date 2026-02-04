import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../service/product';
import { Navbar } from '../../navbar/navbar';
import { StateService } from '../../service/state.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  // Observables for the component state
  private productSubject = new BehaviorSubject<Product | null>(null);
  product$: Observable<Product | null> = this.productSubject.asObservable();
  loading$: Observable<boolean>;
  isInCart$!: Observable<boolean>;
  cartCount$: Observable<number>;
  
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private stateService: StateService
  ) {
    this.loading$ = this.stateService.loading$;
    this.cartCount$ = this.stateService.cart$.pipe(map(cart => cart.length));
  }

  ngOnInit() {
    this.stateService.setLoading(true);

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (isNaN(id)) {
          this.handleError('Invalid product ID.');
          return of(null);
        }
        return this.productService.getProductById(id).pipe(
          catchError(err => {
            this.handleError(err.message);
            return of(null);
          })
        );
      })
    ).subscribe(product => {
      this.productSubject.next(product);
      this.stateService.setLoading(false);

      if (product) {
        this.isInCart$ = this.stateService.cart$.pipe(
          map(cart => cart.some(p => p.id === product.id))
        );
      }
    });
  }

  private handleError(message: string) {
    this.errorMessage = message;
    this.stateService.setLoading(false);
  }

  addToCart() {
    const product = this.productSubject.getValue();
    if (product) {
      this.stateService.addToCart(product);
    }
  }

  removeFromCart() {
    const product = this.productSubject.getValue();
    if (product) {
      this.stateService.removeFromCart(product.id);
    }
  }

  toggleCart() {
    const product = this.productSubject.getValue();
    if (!product) return;

    const cart = this.stateService.stateSubject.getValue().cart;
    if (cart.some(p => p.id === product.id)) {
      this.removeFromCart();
    } else {
      this.addToCart();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
