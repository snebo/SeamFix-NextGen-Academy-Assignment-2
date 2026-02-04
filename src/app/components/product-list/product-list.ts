import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../product-card/product-card';
import { ProductService } from '../../service/product';
import { Navbar } from '../../navbar/navbar';
import { StateService } from '../../service/state.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCard, Navbar],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  // Observables for reactive state management
  products$: Observable<Product[]>;
  cart$: Observable<Product[]>;
  loading$: Observable<boolean>;
  filteredProducts$: Observable<Product[]>;
  cartCount$: Observable<number>;

  // Subject to handle search query changes
  private searchQuery = new BehaviorSubject<string>('');
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private stateService: StateService
  ) {
    // Initialize observables from the state service
    this.products$ = this.stateService.products$;
    this.cart$ = this.stateService.cart$;
    this.loading$ = this.stateService.loading$;
    this.cartCount$ = this.cart$.pipe(map(cart => cart.length));

    // Combine products and search query to get filtered products
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchQuery.asObservable().pipe(startWith(''))
    ]).pipe(
      map(([products, query]) => {
        const searchTerm = query.toLowerCase();
        if (!searchTerm) {
          return products;
        }
        return products.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        );
      })
    );
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.stateService.setLoading(true);
    this.errorMessage = null;

    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.stateService.setProducts(data);
        this.stateService.setLoading(false);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = err.message;
        this.stateService.setLoading(false);
      }
    });
  }

  handleSearch(query: string) {
    this.searchQuery.next(query);
  }

  handleAddToCart(product: Product) {
    this.stateService.addToCart(product);
  }
}
