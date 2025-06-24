import { Injectable } from '@nestjs/common';
import { RegisterUsecase, LoginUseCase, GetTokenUsecase } from './usecases';
import { LoginDto, RegisterDto, LoginResponseDto, UserDto } from '@src/application/auth/dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        private readonly registerUsecase: RegisterUsecase,
        private readonly loginUseCase: LoginUseCase,
        private readonly getTokenUsecase: GetTokenUsecase,
    ) {}

    async register(registerDto: RegisterDto) {
        return this.registerUsecase.execute(registerDto);
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const user = await this.loginUseCase.execute(loginDto);
        const accessToken = await this.getTokenUsecase.execute(user);

        return {
            accessToken,
            user: plainToInstance(UserDto, user),
        };
    }
}
