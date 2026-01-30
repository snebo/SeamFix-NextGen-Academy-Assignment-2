import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [50, [Validators.required, Validators.min(50)]],
      category: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      inStock: [false],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      properties: this.fb.array([this.createProperty()]),
    });
  }

  createProperty(): FormGroup {
    return this.fb.group({
      color: ['', Validators.required],
      weight: ['', Validators.required],
    });
  }

  get properties(): FormArray {
    return this.productForm.get('properties') as FormArray;
  }

  addProperty(): void {
    this.properties.push(this.createProperty());
  }

  removeProperty(index: number): void {
    if (this.properties.length > 1) {
      this.properties.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe({
        next: (res) => {
          console.log('Product created successfully!', res);
          this.productForm.reset();
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error creating product:', err);
        },
      });
    }
  }
}


