import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../product-card/product-card';
import { ProductService } from '../../service/product';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCard, Navbar],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...data];
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

  isProductInCart(id: number): boolean {
    return this.productService.isInCart(id);
  }

  get cart(): Product[] {
    return this.productService.getCart();
  }
}
