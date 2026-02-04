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
import { StateService } from '../../service/state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductFormComponent {
  productForm: FormGroup;
  loading$: Observable<boolean>;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private stateService: StateService
  ) {
    this.loading$ = this.stateService.loading$;

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [50, [Validators.required, Validators.min(50)]],
      category: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.stateService.setLoading(true);
    this.errorMessage = null;

    this.productService.createProduct(this.productForm.value).subscribe({
      next: (res) => {
        console.log('Product created successfully!', res);
        this.stateService.addProduct(res); // Add the new product to the state
        this.stateService.setLoading(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.errorMessage = err.message;
        this.stateService.setLoading(false);
      },
    });
  }
}


