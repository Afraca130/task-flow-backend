import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupSwagger } from '../src/common/swagger/swagger';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { RequestInterceptor } from '../src/common/interceptors/request.interceptor';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RolesGuard } from '../src/common/guards/role.guard';
import { ErrorInterceptor } from '../src/common/interceptors/error.interceptor';
import * as dtos from '../src/common/dtos';
import { Reflector } from '@nestjs/core';

let app: NestExpressApplication;

async function createNestApp() {
    if (!app) {
        app = await NestFactory.create<NestExpressApplication>(AppModule);

        // CORS 설정
        app.enableCors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        });

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                forbidNonWhitelisted: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        );

        // Swagger 설정 (개발 환경에서만)
        if (process.env.NODE_ENV !== 'production') {
            setupSwagger(app, Object.values(dtos));
        }

        // 전역 프리픽스 설정 (Vercel에서는 /api가 자동으로 붙음)
        const apiPrefix = process.env.API_PREFIX ?? 'v1';
        app.setGlobalPrefix(apiPrefix);

        // 전역 가드 및 인터셉터 설정
        app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
        app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor(), new ErrorInterceptor());

        await app.init();
    }
    return app;
}

export default async function handler(req: any, res: any) {
    const app = await createNestApp();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
}
