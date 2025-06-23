import { DateUtil } from '@src/common/utils/date.util';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = request;
        const now = Date.now();

        console.log(`[Request] ${DateUtil.now().toISOString()} ${method} ${url}`);
        // 옵셔널 체이닝과 nullish coalescing 사용
        const bodyKeys = Object.keys(body ?? {});
        const queryKeys = Object.keys(query ?? {});
        const paramsKeys = Object.keys(params ?? {});

        if (bodyKeys.length > 0) {
            console.log('Body:', body);
        }

        if (queryKeys.length > 0) {
            console.log('Query:', query);
        }

        if (paramsKeys.length > 0) {
            console.log('Params:', params);
        }

        return next.handle().pipe(
            tap(() => {
                console.log(`[Response Time] ${Date.now() - now}ms`);
            }),
        );
    }
}
