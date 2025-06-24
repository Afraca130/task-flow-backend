import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as chalk from 'chalk';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ErrorInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const startTime = Date.now();

        return next.handle().pipe(
            catchError((error) => {
                const duration = Date.now() - startTime;

                // 🔥 스택 트레이스 캡처 개선
                const capturedStack = this.captureStack(error);

                if (error instanceof HttpException) {
                    this.logHttpError(error, request, duration, capturedStack);
                    return throwError(() => this.formatHttpError(error, request));
                }

                this.logUnexpectedError(error, request, duration, capturedStack);
                return throwError(() => this.formatUnexpectedError(error, request));
            }),
        );
    }

    private captureStack(error: any): string | null {
        // 1. 원본 에러의 스택
        if (error.stack) {
            return error.stack;
        }

        // 2. 원본 에러가 있는 경우 (wrapped exception)
        if (error.cause && error.cause.stack) {
            return error.cause.stack;
        }

        // 3. 현재 위치에서 스택 캡처
        const stackTrace = new Error().stack;
        if (stackTrace) {
            // ErrorInterceptor 관련 라인들 제거
            const lines = stackTrace.split('\n');
            const filteredLines = lines.filter(
                (line) =>
                    !line.includes('ErrorInterceptor') && !line.includes('rxjs') && !line.includes('node_modules'),
            );
            return filteredLines.join('\n');
        }

        return null;
    }

    private logHttpError(error: HttpException, request: any, duration: number, stack: string | null): void {
        const response = error.getResponse();
        const status = error.getStatus();
        const method = request.method;
        const url = request.url;
        const userAgent = request.get('User-Agent') || '';
        const ip = request.ip || request.connection.remoteAddress;

        // 에러 상세 정보 추출
        const errorDetails = this.extractErrorDetails(response);

        // 헤더 출력
        console.log('\n' + '='.repeat(80));
        console.log(chalk.red.bold(`🚨 HTTP EXCEPTION OCCURRED`));
        console.log('='.repeat(80));

        // 요청 정보 박스
        this.printInfoBox([
            `${chalk.yellow.bold('Status:')} ${this.getStatusWithIcon(status)}`,
            `${chalk.yellow.bold('Method:')} ${chalk.cyan.bold(method)}`,
            `${chalk.yellow.bold('Path:')} ${chalk.cyan.bold(url)}`,
            `${chalk.yellow.bold('Duration:')} ${chalk.magenta(duration + 'ms')}`,
            `${chalk.yellow.bold('IP:')} ${chalk.cyan(ip)}`,
            `${chalk.yellow.bold('Time:')} ${chalk.magenta(new Date().toLocaleString())}`,
        ]);

        // 에러 상세 정보
        console.log(chalk.red.bold('\n💥 Error Details:'));
        console.log(`   ${chalk.yellow('Error Class:')} ${chalk.red.bold(error.constructor.name)}`);
        console.log(`   ${chalk.yellow('Error Code:')} ${chalk.red.bold(errorDetails.error || 'HTTP_EXCEPTION')}`);
        console.log(`   ${chalk.yellow('Message:')} ${chalk.red.bold(errorDetails.message)}`);

        if (errorDetails.details && errorDetails.details.length > 0) {
            console.log(`\n   ${chalk.yellow.bold('Validation Errors:')}`);
            errorDetails.details.forEach((detail, index) => {
                console.log(`     ${chalk.red.bold(`${index + 1}.`)} ${chalk.red(detail)}`);
            });
        }

        // 🔥 개선된 스택 트레이스 출력
        this.printStackTrace(stack, error, 'HTTP Exception');

        // 요청 헤더 정보 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
            console.log(chalk.blue.bold('\n📋 Request Headers:'));
            Object.entries(request.headers).forEach(([key, value]) => {
                if (key.toLowerCase() !== 'authorization') {
                    // 보안상 authorization 제외
                    console.log(`   ${chalk.blue(key)}: ${chalk.gray(String(value).substring(0, 100))}`);
                }
            });
        }

        console.log('='.repeat(80) + '\n');
    }

    private logUnexpectedError(error: any, request: any, duration: number, stack: string | null): void {
        const method = request.method;
        const url = request.url;
        const ip = request.ip || request.connection.remoteAddress;

        console.log('\n' + '='.repeat(80));
        console.log(chalk.red.bold(`🔥 CRITICAL ERROR OCCURRED`));
        console.log('='.repeat(80));

        this.printInfoBox([
            `${chalk.yellow.bold('Type:')} ${chalk.red.bold(error.constructor?.name || 'Unknown Error')}`,
            `${chalk.yellow.bold('Method:')} ${chalk.cyan.bold(method)}`,
            `${chalk.yellow.bold('Path:')} ${chalk.cyan.bold(url)}`,
            `${chalk.yellow.bold('Duration:')} ${chalk.magenta(duration + 'ms')}`,
            `${chalk.yellow.bold('IP:')} ${chalk.cyan(ip)}`,
            `${chalk.yellow.bold('Time:')} ${chalk.magenta(new Date().toLocaleString())}`,
        ]);

        console.log(chalk.red.bold('\n💀 Error Details:'));
        console.log(`   ${chalk.yellow('Message:')} ${chalk.red.bold(error.message || 'No error message')}`);

        if (error.code) {
            console.log(`   ${chalk.yellow('Error Code:')} ${chalk.red.bold(error.code)}`);
        }

        if (error.errno) {
            console.log(`   ${chalk.yellow('Error Number:')} ${chalk.red.bold(error.errno)}`);
        }

        if (error.syscall) {
            console.log(`   ${chalk.yellow('System Call:')} ${chalk.red.bold(error.syscall)}`);
        }

        // 🔥 개선된 스택 트레이스 출력
        this.printStackTrace(stack, error, 'Unexpected Error');

        console.log('='.repeat(80) + '\n');

        // Logger로도 기록
        this.logger.error(`Critical error on ${method} ${url}`, stack || error.stack);
    }

    private printStackTrace(capturedStack: string | null, originalError: any, errorType: string): void {
        console.log(chalk.red.bold('\n📚 Stack Trace Analysis:'));

        // 1. 캡처된 스택이 있는 경우
        if (capturedStack) {
            console.log(chalk.yellow.bold('\n🔍 Captured Stack Trace:'));
            this.formatAndPrintStack(capturedStack);
        }

        // 2. 원본 에러의 스택
        if (originalError.stack && originalError.stack !== capturedStack) {
            console.log(chalk.yellow.bold('\n📄 Original Error Stack:'));
            this.formatAndPrintStack(originalError.stack);
        }

        // 3. Cause 체인 확인
        if (originalError.cause) {
            console.log(chalk.yellow.bold('\n🔗 Error Cause Chain:'));
            this.printCauseChain(originalError.cause, 1);
        }

        // 4. 스택이 전혀 없는 경우
        if (!capturedStack && !originalError.stack) {
            console.log(chalk.red.bold('\n❌ No stack trace available'));
            console.log(`   ${chalk.yellow('Error Type:')} ${errorType}`);
            console.log(
                `   ${chalk.yellow('Suggestion:')} This might be a custom exception without proper stack trace`,
            );

            // 현재 호출 스택 생성
            const currentStack = new Error(`Stack trace for ${errorType}`).stack;
            if (currentStack) {
                console.log(chalk.yellow.bold('\n🔧 Generated Stack Trace:'));
                this.formatAndPrintStack(currentStack);
            }
        }
    }

    private formatAndPrintStack(stack: string): void {
        const lines = stack.split('\n');

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (index === 0) {
                // 첫 번째 라인 (에러 메시지)
                console.log(`   ${chalk.red.bold(trimmedLine)}`);
            } else if (trimmedLine.startsWith('at ')) {
                // 스택 프레임 라인들
                const isAppCode = this.isApplicationCode(trimmedLine);
                const isNodeModule = trimmedLine.includes('node_modules');
                const isInternal = trimmedLine.includes('internal/') || trimmedLine.includes('<anonymous>');

                if (isAppCode) {
                    // 앱 코드는 강조 표시
                    console.log(`   ${chalk.red('📍')} ${chalk.white.bold(trimmedLine)}`);
                } else if (isNodeModule) {
                    // node_modules는 회색으로
                    console.log(`   ${chalk.gray('📦')} ${chalk.gray(trimmedLine)}`);
                } else if (isInternal) {
                    // 내부 코드는 더 연하게
                    console.log(`   ${chalk.gray('⚙️ ')} ${chalk.gray(trimmedLine)}`);
                } else {
                    // 기타
                    console.log(`   ${chalk.cyan('🔧')} ${chalk.cyan(trimmedLine)}`);
                }
            } else if (trimmedLine) {
                // 기타 정보
                console.log(`   ${chalk.gray(trimmedLine)}`);
            }
        });
    }

    private isApplicationCode(stackLine: string): boolean {
        const appIndicators = ['/src/', '/dist/', process.cwd()];

        const excludeIndicators = ['node_modules', 'internal/', '/rxjs/', '/nestjs/'];

        return (
            appIndicators.some((indicator) => stackLine.includes(indicator)) &&
            !excludeIndicators.some((exclude) => stackLine.includes(exclude))
        );
    }

    private printCauseChain(cause: any, depth: number): void {
        const indent = '  '.repeat(depth);

        console.log(
            `${indent}${chalk.yellow(`${depth}.`)} ${chalk.red(cause.constructor?.name || 'Unknown')}: ${chalk.red(cause.message || 'No message')}`,
        );

        if (cause.stack) {
            const firstStackLine = cause.stack.split('\n')[1];
            if (firstStackLine) {
                console.log(`${indent}   ${chalk.gray(firstStackLine.trim())}`);
            }
        }

        if (cause.cause && depth < 5) {
            // 무한 루프 방지
            this.printCauseChain(cause.cause, depth + 1);
        }
    }

    private printInfoBox(lines: string[]): void {
        const maxLength = Math.max(...lines.map((line) => this.stripAnsi(line).length));
        const boxWidth = Math.min(maxLength + 4, 100);

        console.log(chalk.red('┌' + '─'.repeat(boxWidth - 2) + '┐'));
        lines.forEach((line) => {
            const padding = boxWidth - this.stripAnsi(line).length - 3;
            console.log(chalk.red('│ ') + line + ' '.repeat(Math.max(0, padding)) + chalk.red('│'));
        });
        console.log(chalk.red('└' + '─'.repeat(boxWidth - 2) + '┘'));
    }

    private stripAnsi(str: string): string {
        return str.replace(/\u001b\[[0-9;]*m/g, '');
    }

    private getStatusWithIcon(status: number): string {
        const statusStr = status.toString();
        if (status >= 500) return chalk.red.bold('💀 ' + statusStr);
        if (status >= 400) return chalk.red.bold('❌ ' + statusStr);
        if (status >= 300) return chalk.yellow.bold('⚠️  ' + statusStr);
        return chalk.green.bold('✅ ' + statusStr);
    }

    private extractErrorDetails(response: any): {
        message: string;
        error?: string;
        details?: string[];
    } {
        if (typeof response === 'string') {
            return { message: response };
        }

        if (typeof response === 'object') {
            const message = response.message;
            const error = response.error;

            let formattedMessage: string;
            let details: string[] = [];

            if (Array.isArray(message)) {
                formattedMessage = message[0] || '유효성 검사에 실패했습니다.';
                details = message;
            } else if (typeof message === 'object') {
                formattedMessage = JSON.stringify(message);
            } else {
                formattedMessage = message || '알 수 없는 오류가 발생했습니다.';
            }

            return { message: formattedMessage, error, details };
        }

        return { message: '알 수 없는 오류가 발생했습니다.' };
    }

    private formatHttpError(error: HttpException, request: any): any {
        const response = error.getResponse();
        const errorDetails = this.extractErrorDetails(response);
        const status = error.getStatus();

        return {
            success: false,
            error: errorDetails.error || this.getErrorCodeByStatus(status),
            message: errorDetails.message,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            requestId: this.generateRequestId(),
            ...(errorDetails.details &&
                errorDetails.details.length > 0 && {
                    validationErrors: errorDetails.details,
                }),
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
            requestId: this.generateRequestId(),
            ...(process.env.NODE_ENV === 'development' && {
                originalError: error.message,
                stack: error.stack,
            }),
        };
    }

    private getErrorCodeByStatus(status: number): string {
        const statusCodes = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            405: 'METHOD_NOT_ALLOWED',
            409: 'CONFLICT',
            422: 'UNPROCESSABLE_ENTITY',
            429: 'TOO_MANY_REQUESTS',
            500: 'INTERNAL_SERVER_ERROR',
            502: 'BAD_GATEWAY',
            503: 'SERVICE_UNAVAILABLE',
        };

        return statusCodes[status] || 'UNKNOWN_ERROR';
    }

    private generateRequestId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
