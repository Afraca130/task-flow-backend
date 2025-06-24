import { Module } from '@nestjs/common';
import { DomainUserModule } from '@src/domain/user/user.module';
import { AuthService } from './auth.service';
import { RegisterUsecase } from './usecases/register.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/domain/entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { LoginUseCase } from './usecases/login.usecase';
import { GetTokenUsecase } from './usecases/get-token.usecase';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [PassportModule, DomainUserModule],
    providers: [AuthService, RegisterUsecase, LoginUseCase, JwtStrategy, GetTokenUsecase],
    controllers: [AuthController],
    exports: [JwtStrategy],
})
export class AuthModule {}
