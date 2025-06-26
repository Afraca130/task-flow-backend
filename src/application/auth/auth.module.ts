import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DomainUserModule } from '@src/domain/user/user.module';
import { AuthService } from './auth.service';
import { RegisterUsecase } from './usecases/register.usecase';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { LoginUseCase } from './usecases/login.usecase';
import { GetTokenUsecase } from './usecases/get-token.usecase';

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: false,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const secret =
                    configService.get<string>('SUPABASE_JWT_SECRET') || 'fallback-secret-key-for-development';
                console.log('JWT Secret configured:', !!secret);
                return {
                    secret,
                    signOptions: {
                        expiresIn: '1d',
                        algorithm: 'HS256',
                    },
                };
            },
            inject: [ConfigService],
        }),
        DomainUserModule,
    ],
    providers: [AuthService, RegisterUsecase, LoginUseCase, GetTokenUsecase, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
