import { ApiDataResponse } from '@src/common/decorators/api-response.decorator';
import { Public } from '@src/common/decorators/pulic.decorator';
import { Controller, Post, Body, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { RegisterDto } from '@src/application/auth/dtos';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { UserDto } from '../dtos/user-response.dto';
import { AuthService } from '../auth.service';
import { ErrorResponseDto } from '@src/common/dtos/response.dto';

@ApiTags('인증')
@Controller('auth')
@Public()
export class AuthController {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    @ApiOperation({
        summary: '회원가입',
        description: '새로운 사용자 계정을 생성합니다.',
    })
    @ApiBody({
        type: RegisterDto,
        description: '회원가입 정보',
    })
    @ApiDataResponse(UserDto, {
        status: HttpStatus.CREATED,
        description: '회원가입이 성공적으로 완료되었습니다.',
        includeAuth: false,
        additionalErrors: [
            ApiConflictResponse({
                description: '이미 존재하는 이메일입니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({
        summary: '로그인',
        description: '사용자 로그인을 처리하고 액세스 토큰을 발급합니다.',
    })
    @ApiBody({
        type: LoginDto,
        description: '로그인 정보',
    })
    @ApiDataResponse(LoginResponseDto, {
        status: HttpStatus.OK,
        description: '로그인이 성공적으로 완료되었습니다.',
        includeAuth: false,
        additionalErrors: [
            ApiBadRequestResponse({
                description: '잘못된 이메일 또는 비밀번호입니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
