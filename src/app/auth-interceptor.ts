import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const email = localStorage.getItem('userEmail');

  // attching the header for product-related endpoints
  const isProductRequest = req.url.includes('/products') || req.url.includes('/cart'); // TODO: for when i include cart page

  if (!email || !isProductRequest) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      'X-User-Email': email,
    },
  });

  return next(authReq);
};
