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
  isInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(id).subscribe({
      next: (data: Product) => {
        this.product = data;
        this.isInCart = this.productService.isInCart(id);
        this.cdr.detectChanges()
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
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  get cart(): Product[] {
    return this.productService.getCart();
  }
}
