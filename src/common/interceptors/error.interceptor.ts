import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as chalk from 'chalk';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof HttpException) {
                    this.logHttpError(error, request);
                    return throwError(() => this.formatError(error, request));
                }

                this.logUnexpectedError(error, request);
                return throwError(() => this.formatUnexpectedError(error, request));
            }),
        );
    }

    private logHttpError(error: HttpException, request: any): void {
        const status = error.getStatus();
        const message = error.message;
        const method = request.method;
        const url = request.url;

        // 🚨 간단한 에러 로그
        console.log('\n' + chalk.red('━'.repeat(60)));
        console.log(chalk.red.bold(`🚨 ${this.getStatusIcon(status)} ${status} ERROR`));
        console.log(chalk.red('━'.repeat(60)));
        console.log(`${chalk.yellow('➤')} ${chalk.cyan.bold(method)} ${chalk.cyan.bold(url)}`);
        console.log(`${chalk.yellow('➤')} ${chalk.red.bold(message)}`);

        // 📚 스택 트레이스 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development' && error.stack) {
            console.log(
                `${chalk.yellow('➤')} ${chalk.gray('Stack:')} ${chalk.gray(this.getFirstStackLine(error.stack))}`,
            );
        }

        console.log(chalk.red('━'.repeat(60)) + '\n');
    }

    private logUnexpectedError(error: any, request: any): void {
        const method = request.method;
        const url = request.url;

        console.log('\n' + chalk.red('━'.repeat(60)));
        console.log(chalk.red.bold(`🔥 UNEXPECTED ERROR`));
        console.log(chalk.red('━'.repeat(60)));
        console.log(`${chalk.yellow('➤')} ${chalk.cyan.bold(method)} ${chalk.cyan.bold(url)}`);
        console.log(`${chalk.yellow('➤')} ${chalk.red.bold(error.message || 'Unknown error')}`);

        if (error.stack) {
            console.log(
                `${chalk.yellow('➤')} ${chalk.gray('Stack:')} ${chalk.gray(this.getFirstStackLine(error.stack))}`,
            );
        }

        console.log(chalk.red('━'.repeat(60)) + '\n');
    }

    private getFirstStackLine(stack: string): string {
        const lines = stack.split('\n');
        // 첫 번째 'at' 라인 찾기 (실제 코드 위치)
        const firstStackLine = lines.find((line) => line.trim().startsWith('at ') && !line.includes('node_modules'));
        return firstStackLine ? firstStackLine.trim() : lines[1]?.trim() || 'No stack available';
    }

    private getStatusIcon(status: number): string {
        if (status >= 500) return '💀';
        if (status >= 400) return '❌';
        if (status >= 300) return '⚠️';
        return '✅';
    }

    private formatError(error: HttpException, request: any): any {
        const response = error.getResponse();
        const status = error.getStatus();

        // HttpException의 response에서 메시지 추출
        let message = error.message;
        if (typeof response === 'object' && response['message']) {
            message = Array.isArray(response['message']) ? response['message'].join(', ') : response['message'];
        }

        return {
            success: false,
            error: this.getErrorCode(status),
            message: message,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };
    }

    private formatUnexpectedError(error: any, request: any): any {
        return {
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: '예상치 못한 오류가 발생했습니다.',
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };
    }

    private getErrorCode(status: number): string {
        const codes = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'UNPROCESSABLE_ENTITY',
            500: 'INTERNAL_SERVER_ERROR',
        };
        return codes[status] || 'HTTP_ERROR';
    }
}
