import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((result): ApiResponse<T> => {
                const hasDataProperty = result && typeof result === 'object' && 'data' in result;

                return {
                    success: true,
                    message: '요청이 성공적으로 처리되었습니다.',
                    data: hasDataProperty ? result.data : result,
                    ...(result.meta && { meta: result.meta }),
                };
            }),
        );
    }
}
