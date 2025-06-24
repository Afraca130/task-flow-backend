import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from '@src/dtos.index';
import { RegisterUsecase } from './usecases/register.usecase';
import { LoginResponseDto } from './dtos/login-response.dto';
import { GetTokenUsecase } from './usecases/get-token.usecase';
import { LoginUseCase } from './usecases/login.usecase';
import { UserDto } from './dtos/user-response.dto';

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
            user: UserDto.fromEntity(user),
        };
    }
}
