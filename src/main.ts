// import { NestFactory, Reflector } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { AppModule } from './app.module';
// import { setupSwagger } from './common/swagger/swagger';
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// import { RequestInterceptor } from './common/interceptors/request.interceptor';
// import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { RolesGuard } from './common/guards/role.guard';
// import { ErrorInterceptor } from './common/interceptors/error.interceptor';
// import * as dtos from './common/dtos';

// async function bootstrap() {
//     const app = await NestFactory.create<NestExpressApplication>(AppModule);

//     app.enableCors({
//         // origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
//         origin: ['http://localhost:3000', 'https://task-flow-frontend-88nu.vercel.app'],
//         credentials: true,
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//         allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//     });

//     app.useGlobalPipes(
//         new ValidationPipe({
//             transform: true,
//             forbidNonWhitelisted: true,
//             transformOptions: {
//                 enableImplicitConversion: true,
//             },
//         }),
//     );

//     // Swagger 설정
//     setupSwagger(app, Object.values(dtos));
//     // 전역 프리픽스 설정
//     const apiPrefix = process.env.API_PREFIX ?? 'v1';
//     app.setGlobalPrefix(`/api/${apiPrefix}`);
//     // version 설정
//     app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
//     // 전역 인터셉트 등록
//     app.useGlobalPipes(new ValidationPipe());
//     app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor(), new ErrorInterceptor());

//     const port = process.env.PORT || 3001;
//     app.listen(port);
// }
// bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RolesGuard } from './common/guards/role.guard';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import * as dtos from './common/dtos';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // CORS 설정 (프로덕션 환경에서 중요)
    app.enableCors({
        origin: ['http://localhost:3000', 'https://task-flow-frontend-88nu.vercel.app'],
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

    // Swagger 설정 (개발/스테이징 환경에서만)
    if (process.env.NODE_ENV !== 'production') {
        setupSwagger(app, Object.values(dtos));
    }

    // 전역 프리픽스 설정
    const apiPrefix = process.env.API_PREFIX ?? 'v1';
    app.setGlobalPrefix(`api/${apiPrefix}`);

    // 전역 가드 및 인터셉터 설정
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
    app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor(), new ErrorInterceptor());

    const port = process.env.PORT || 3000;

    // Vercel에서는 listen을 await 해야 함
    await app.listen(port, '0.0.0.0');

    console.log(`🚀 Application is running on: ${await app.getUrl()}`);

    return app;
}

// Vercel serverless 환경 대응
if (require.main === module) {
    bootstrap().catch((err) => {
        console.error('Failed to start application:', err);
        process.exit(1);
    });
}

// Vercel Function으로 export
export default bootstrap;
