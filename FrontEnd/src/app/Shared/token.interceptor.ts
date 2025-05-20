import { HttpInterceptorFn } from '@angular/common/http';
import { TokenDecodeService } from './services/token-decode.service';
import { inject } from '@angular/core';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(TokenDecodeService);
  const token = service.getToken();

  const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  return next(authReq);
};
