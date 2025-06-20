import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestInterceptor } from '@libs/interceptors/request.interceptor';
import { ResponseInterceptor } from '@libs/interceptors/response.interceptor';
import { ErrorInterceptor } from '@libs/interceptors/error.interceptor';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { RolesGuard } from '@libs/guards/role.guard';
import { setupSwagger } from '@libs/swagger/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const isProduction = process.env.NODE_ENV === 'production';

    // CORS 설정
    // app.enableCors({
    //     origin: isProduction
    //         ? function (origin, callback) {
    //               console.log('isProduction :', isProduction);
    //               console.log('origin :', origin);
    //               const whitelist = [
    //                   'https://lrms.lumir.space',
    //                   'https://rms-backend-iota.vercel.app',
    //                   'https://lrms-dev.lumir.space',
    //                   'http://localhost:3002',
    //               ];
    //               if (!isProduction || !origin || whitelist.includes(origin)) {
    //                   callback(null, true);
    //               } else {
    //                   callback(new Error('Not allowed by CORS'));
    //               }
    //           }
    //         : true,
    //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    //     credentials: true,
    // });

    // 전역 프리픽스 설정
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
    // 전역 인터셉트 등록
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor(), new ErrorInterceptor());

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
