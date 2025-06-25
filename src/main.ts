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

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger 설정
    setupSwagger(app, Object.values(dtos));

    // 전역 프리픽스 설정
    const apiPrefix = process.env.API_PREFIX ?? 'v1';
    app.setGlobalPrefix(`/api/${apiPrefix}`);
    // version 설정
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
    // 전역 인터셉트 등록
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor(), new ErrorInterceptor());

    const port = process.env.PORT || 3001;
    app.listen(port);
}
bootstrap();
