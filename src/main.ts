import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dtos from './dtos.index';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestInterceptor } from '@src/common/interceptors/request.interceptor';
import { ResponseInterceptor } from '@src/common/interceptors/response.interceptor';
import { ErrorInterceptor } from '@src/common/interceptors/error.interceptor';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/role.guard';
import { setupSwagger } from '@src/common/swagger/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // 전역 프리픽스 설정
    const apiPrefix = process.env.API_PREFIX ?? 'v1';
    app.setGlobalPrefix(`/api/${apiPrefix}`);
    // version 설정
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
    // 전역 인터셉트 등록
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor(), new ErrorInterceptor());
    setupSwagger(app, Object.values(dtos));

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
