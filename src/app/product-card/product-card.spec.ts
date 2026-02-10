import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

class MockRouter {
  navigate = vi.fn();
}

class MockStateService {
  cart$ = of([]);
}

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;
  let mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    imageUrl: 'http://test.com/image.jpg',
    category: 'Test Category',
    rating: 4
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: StateService, useClass: MockStateService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = mockProduct; // Provide the mock product
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

