import { Module } from '@nestjs/common';
import { DomainUserModule } from '@src/domain/user/user.module';
import { AuthService } from './auth.service';
import { RegisterUsecase } from './usecases/register.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/domain/entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [DomainUserModule, TypeOrmModule.forFeature([User])],
    providers: [AuthService, RegisterUsecase, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
