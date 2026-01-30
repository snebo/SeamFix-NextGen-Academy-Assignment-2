import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model'; // Removed .ts extension

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productJsonApiUrl = 'http://localhost:3000/products';
  private cart = signal<Product[]>([]);

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productJsonApiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productJsonApiUrl}/${id}`); // Fixed: added parentheses for template literal
  }

  isInCart(id: number): boolean {
    return this.cart().some((p: Product) => p.id === id);
  }

  toggleCart(product: Product): void { // Fixed: typo 'toogleCart' -> 'toggleCart'
    const currentCart = this.cart();
    const idx = currentCart.findIndex((p: Product) => p.id === product.id);

    if (idx > -1) {
      this.cart.set(currentCart.filter((p: Product) => p.id !== product.id));
    } else {
      this.cart.set([...currentCart, product]);
    }
  }

  getCart(): Product[] {
    return this.cart();
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productJsonApiUrl, product);
  }
}
