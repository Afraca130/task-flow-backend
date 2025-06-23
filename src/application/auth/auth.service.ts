import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from '@src/dtos.index';
import { RegisterUsecase } from './usecases/register.usecase';

@Injectable()
export class AuthService {
    constructor(private readonly authUsecase: RegisterUsecase) {}

    async register(registerDto: RegisterDto) {
        return this.authUsecase.execute(registerDto);
    }

    async login(loginDto: LoginDto) {
        return loginDto;
    }
}
