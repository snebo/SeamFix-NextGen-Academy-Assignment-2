import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product';
import { CategoryService } from '../../service/category';
import { Router } from '@angular/router';
import { StateService } from '../../service/state.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Category } from '../../models/category.model';

import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Navbar],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  loading$: Observable<boolean>;
  errorMessage: string | null = null;
  categories$: Observable<Category[]>;
  isNewCategory = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private stateService: StateService
  ) {
    this.loading$ = this.stateService.loading$;

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [50, [Validators.required, Validators.min(50)]],
      categoryId: [''],
      newCategoryName: [''],
      newCategoryDescription: [''],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });

    this.categories$ = this.categoryService.getAllCategories().pipe(
      map((res: any) => Array.isArray(res) ? res : (res.data || []))
    );

    // Set initial validation
    this.updateCategoryValidation();
  }

  ngOnInit(): void {
  }

  toggleCategoryType() {
    this.isNewCategory = !this.isNewCategory;
    this.updateCategoryValidation();
  }

  private updateCategoryValidation() {
    const catId = this.productForm.get('categoryId');
    const newCatName = this.productForm.get('newCategoryName');

    if (this.isNewCategory) {
      catId?.clearValidators();
      newCatName?.setValidators([Validators.required, Validators.minLength(3)]);
      catId?.setValue('');
    } else {
      catId?.setValidators([Validators.required]);
      newCatName?.clearValidators();
      newCatName?.setValue('');
      this.productForm.get('newCategoryDescription')?.setValue('');
    }

    catId?.updateValueAndValidity();
    newCatName?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.stateService.setLoading(true);
    this.errorMessage = null;

    const formValues = this.productForm.value;

    // 1. Handle Category Creation if needed
    const categoryAction$ = this.isNewCategory 
      ? this.categoryService.createCategory({
          name: formValues.newCategoryName,
          description: formValues.newCategoryDescription
        }).pipe(
          map(cat => cat.id),
          catchError(err => {
            throw new Error('Failed to create new category: ' + err.message);
          })
        )
      : of(Number(formValues.categoryId));

    // 2. Create Product using the category ID
    categoryAction$.pipe(
      switchMap(categoryId => {
        const productPayload = {
          name: formValues.name,
          description: formValues.description,
          price: formValues.price,
          imageUrl: formValues.imageUrl,
          categoryId: categoryId
        };
        return this.productService.createProduct(productPayload as any);
      })
    ).subscribe({
      next: (res) => {
        console.log('Product created successfully!', res);
        this.stateService.addProduct(res);
        this.stateService.setLoading(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error in product creation flow:', err);
        this.errorMessage = err.message;
        this.stateService.setLoading(false);
      },
    });
  }
}
