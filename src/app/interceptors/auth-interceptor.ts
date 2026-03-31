import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  console.log('Auth Interceptor - Token:', token ? 'Present' : 'Not found');
  console.log('Auth Interceptor - URL:', req.url);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Auth Interceptor - Authorization header added');
  } else {
    console.log('Auth Interceptor - No token, request sent without auth');
  }

  return next(req);
};