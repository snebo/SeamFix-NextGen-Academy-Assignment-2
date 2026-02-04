import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../models/app-state.model';
import { Product } from '../models/product.model';

// Define the initial state of the application
const initialState: AppState = {
  products: [],
  cart: [],
  loading: false,
  productsLoaded: false,
};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // The BehaviorSubject that holds the current state
  readonly stateSubject = new BehaviorSubject<AppState>(initialState);

  // Read-only observable for the entire state
  readonly state$: Observable<AppState> = this.stateSubject.asObservable();

  // --- Selectors: Observables for specific slices of state ---
  readonly products$: Observable<Product[]> = this.state$.pipe(map(state => state.products));
  readonly cart$: Observable<Product[]> = this.state$.pipe(map(state => state.cart));
  readonly loading$: Observable<boolean> = this.state$.pipe(map(state => state.loading));
  readonly productsLoaded$: Observable<boolean> = this.state$.pipe(map(state => state.productsLoaded));

  // --- State Snapshot Getter ---
  public get currentStateValue(): AppState {
    return this.stateSubject.getValue();
  }

  constructor() {}

  // --- Updater Methods: For modifying the state immutably ---

  setLoading(loading: boolean): void {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, loading });
  }

  setProducts(products: Product[]): void {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, products, productsLoaded: true });
  }

  addProduct(product: Product): void {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({
      ...currentState,
      products: [...currentState.products, product]
    });
  }

  addToCart(product: Product): void {
    const currentState = this.stateSubject.getValue();
    // Avoid adding duplicates
    if (!currentState.cart.find(p => p.id === product.id)) {
      this.stateSubject.next({ ...currentState, cart: [...currentState.cart, product] });
    }
  }

  removeFromCart(productId: number): void {
    const currentState = this.stateSubject.getValue();
    const updatedCart = currentState.cart.filter(p => p.id !== productId);
    this.stateSubject.next({ ...currentState, cart: updatedCart });
  }
}
