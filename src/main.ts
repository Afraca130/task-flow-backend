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

    // CORS 설정
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.10.189:3000'],
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

    // Swagger 설정 (로컬 개발환경에서만)
    setupSwagger(app, Object.values(dtos));

    // 전역 프리픽스 설정
    const apiPrefix = process.env.API_PREFIX ?? 'v1';
    app.setGlobalPrefix(`api/${apiPrefix}`);

    // 전역 가드 및 인터셉터 설정
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
    app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor(), new ErrorInterceptor());

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

// 로컬 개발용으로만 실행
bootstrap();
