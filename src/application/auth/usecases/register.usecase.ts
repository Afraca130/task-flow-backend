import { ConflictException, Injectable } from '@nestjs/common';
import { DomainUserService } from '@src/domain/user/user.service';
import { RegisterDto } from '@src/application/auth/dtos';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterUsecase {
    constructor(private readonly userService: DomainUserService) {}

    async execute(registerDto: RegisterDto) {
        // 이미 존재하는 이메일인지 확인
        const existingUser = await this.userService.findUserByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);

        // 사용자 생성
        const createUser = await this.userService.create({
            email: registerDto.email,
            password: hashedPassword,
            name: registerDto.name,
        });

        const user = await this.userService.save(createUser);

        return {
            user: user,
            message: '회원가입이 성공적으로 완료되었습니다.',
        };
    }
}
