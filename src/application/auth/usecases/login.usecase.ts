import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { DomainUserService } from '@src/domain/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@src/domain/entities/user.entity';

@Injectable()
export class LoginUseCase {
    private readonly logger = new Logger(LoginUseCase.name);

    constructor(private readonly userService: DomainUserService) {}

    async execute(loginDto: LoginDto): Promise<User> {
        this.logger.log(`Login attempt for email: ${loginDto.email}`);

        // 사용자 조회
        const user = await this.userService.findUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('잘못된 이메일 또는 비밀번호입니다.');
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('잘못된 이메일 또는 비밀번호입니다.');
        }

        // 계정 활성화 상태 확인
        if (!user.isActive) {
            throw new UnauthorizedException('비활성화된 계정입니다.');
        }

        await this.userService.updateLastLoginAt(user.id, new Date());

        return user;
    }
}
