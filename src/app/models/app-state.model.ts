import { Product } from './product.model';

export interface AppState {
  products: Product[];
  cart: Product[];
  loading: boolean;
}
