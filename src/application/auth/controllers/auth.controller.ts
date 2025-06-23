import { ApiDataResponse } from '@src/common/decorators/api-response.decorator';
import { Public } from '@src/common/decorators/pulic.decorator';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger/dist';
import { RegisterDto } from '@src/dtos.index';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '@src/application/auth/auth.service';

@ApiTags('1. 인증')
@Controller('auth')
@Public()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: '회원가입' })
    @ApiDataResponse({ status: 201, description: '회원가입 성공', type: RegisterDto })
    async register(@Body() registerDto: RegisterDto) {
        console.log(registerDto);
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: '회원가입' })
    @ApiDataResponse({ status: 201, description: '회원가입 성공', type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
