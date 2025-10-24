import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private readonly _cache = new Map<string, HttpResponse<any>>();

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const noCache = req.headers.get('x-no-cache');

    if (req.method !== 'GET' || noCache === 'true') {
      return next.handle(req);
    }

    const cachedResponse = this._cache.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this._cache.set(req.urlWithParams, event.clone());
        }
      })
    );
  }
}
