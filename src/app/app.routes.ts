import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { Cart } from './components/cart/cart';
import { NotFound } from './components/not-found/not-found';
import { ProductFormComponent } from './components/product-form/product-form';
import { authGuard } from './guards/auth-guard';
import { Login } from './auth/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'products',
    component: ProductList,
    canActivate: [authGuard],
  },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'products/:id',
    component: ProductDetail,
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFound,
  },
];
