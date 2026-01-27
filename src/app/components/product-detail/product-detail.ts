import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../service/product';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  product?: Product;
  category: string = '';
  isInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Get product ID from route params
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Get category from query params
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
    });

    // Fetch product by ID from API
    this.productService.getProductById(id).subscribe({
      next: (data: Product) => {
        this.product = data;
        // Use category from query params instead of API
        if (this.category) {
          this.product.category = this.category;
        }
        this.isInCart = this.productService.isInCart(id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.router.navigate(['/not-found']);
      }
    });
  }

  toggleCart() {
    if (this.product) {
      this.productService.toggleCart(this.product);
      this.isInCart = this.productService.isInCart(this.product.id);
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  get cart(): Product[] {
    return this.productService.getCart();
  }
}
