import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiInterceptorService } from '../services/api-interceptor.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
	constructor(private readonly apiInterceptorService: ApiInterceptorService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next
			.handle(request)
			.pipe(tap((event) => this.apiInterceptorService.handleEvent(event as HttpResponse<never>)));
	}
}
