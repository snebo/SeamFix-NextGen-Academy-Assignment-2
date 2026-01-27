import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './models/product.model';
import { Navbar } from './navbar/navbar';
import { ProductCard } from './product-card/product-card';
import { CommonModule } from '@angular/common';
import { ProductService } from './service/product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ProductCard, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('product_browsing_interface');

  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('COmponent Iniialized')
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...data];
        console.log('filteredProducts: ', this.filteredProducts)
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  handleSearch(query: string) {
    const searchTerm = query.toLowerCase();
    this.filteredProducts = this.products.filter((p: Product) =>
      p.name.toLowerCase().includes(searchTerm)
    );
  }

  handleCardClicked(clickedItem: Product) {
    this.productService.toggleCart(clickedItem);
  }

  trackByProductId(Index: number, product: Product): number {
    return product.id;
  }

  isProductInCart(id: number): boolean {
    return this.productService.isInCart(id);
  }

  get cart(): Product[] {
    return this.productService.getCart();
  }
}
