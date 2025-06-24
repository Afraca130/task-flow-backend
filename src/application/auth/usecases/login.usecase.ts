import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DomainUserService } from '@src/domain/user/user.service';
import { LoginDto } from '../dtos/login.dto';
import { User } from '@src/domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginUseCase {
    constructor(private readonly userService: DomainUserService) {}

    async execute(loginDto: LoginDto): Promise<User> {
        const { email, password } = loginDto;
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('일치하는 이메일이 없습니다.');
        }

        // 계정 활성화 확인
        if (!user.isActive) {
            throw new UnauthorizedException('비활성화된 계정입니다.');
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        // 마지막 로그인 시간 업데이트
        await this.userService.updateLastLoginAt(user.id, new Date());

        return user;
    }
}
