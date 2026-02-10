import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetail } from './product-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../service/state.service';
import { ProductService } from '../../service/product';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { vi } from 'vitest';

class MockActivatedRoute {
  private _paramMap = new BehaviorSubject({ get: (key: string) => (key === 'id' ? '1' : null) });
  paramMap = this._paramMap.asObservable();
  queryParamMap = of({ get: (key: string) => (key === 'category' ? 'Test Category' : null) });
}

class MockRouter {
  navigate = vi.fn();
}

class MockStateService {
  cart$ = of([]);
  loading$ = of(false);
  stateSubject = new BehaviorSubject({ cart: [], loading: false, searchTerm: '' });
  setLoading = vi.fn();
  addToCart = vi.fn();
  removeFromCart = vi.fn();
}

class MockProductService {
  getProductById(id: number): Observable<Product> {
    return of({
      id: id,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      imageUrl: 'http://test.com/image.jpg',
      category: 'Test Category',
      rating: 4
    });
  }
}

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;
  let mockStateService: MockStateService;
  let mockProductService: MockProductService;

  beforeEach(async () => {
    mockActivatedRoute = new MockActivatedRoute();
    mockRouter = new MockRouter();
    mockStateService = new MockStateService();
    mockProductService = new MockProductService();

    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: StateService, useValue: mockStateService },
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // ngOnInit is called here
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
