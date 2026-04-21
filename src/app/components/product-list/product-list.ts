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
  products$: Observable<Product[]>;
  cart$: Observable<Product[]>;
  loading$: Observable<boolean>;
  filteredProducts$: Observable<Product[]>;
  cartCount$: Observable<number>;

  private searchQuery = new BehaviorSubject<string>('');
  private categoryQuery = new BehaviorSubject<string>('');
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private stateService: StateService
  ) {
    this.products$ = this.stateService.products$;
    this.cart$ = this.stateService.cart$;
    this.loading$ = this.stateService.loading$;
    this.cartCount$ = this.cart$.pipe(map(cart => cart.length));

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchQuery.asObservable().pipe(startWith('')),
      this.categoryQuery.asObservable().pipe(startWith(''))
    ]).pipe(
      map(([products, query, category]) => {
        const searchTerm = query.toLowerCase();
        const selectedCategory = category.toLowerCase();

        return products.filter(p => {
          const name = p.name.toLowerCase();
          const description = (p.description || '').toLowerCase();
          const pCategory = (typeof p.category === 'string' ? p.category : p.category?.name || '').toLowerCase();
          
          const matchesSearch = !searchTerm || 
                               name.includes(searchTerm) || 
                               description.includes(searchTerm) ||
                               pCategory.includes(searchTerm);
          
          const matchesCategory = !selectedCategory || pCategory === selectedCategory;

          return matchesSearch && matchesCategory;
        });
      })
    );
  }

  ngOnInit() {
    if (!this.stateService.currentStateValue.productsLoaded) {
      this.loadProducts();
    }
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

  handleCategoryChange(category: string) {
    this.categoryQuery.next(category);
  }

  handleAddToCart(product: Product) {
    this.stateService.addToCart(product);
  }
}
