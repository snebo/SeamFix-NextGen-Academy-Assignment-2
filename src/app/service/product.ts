import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productJsonApiUrl = `${environment.baseUrl}/product`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productJsonApiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productJsonApiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productJsonApiUrl, product);
  }
}
