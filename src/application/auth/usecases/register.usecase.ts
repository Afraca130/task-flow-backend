import { BadRequestException, Injectable } from '@nestjs/common';
import { DomainUserService } from '@src/domain/user/user.service';
import { RegisterDto } from '@src/dtos.index';

@Injectable()
export class RegisterUsecase {
    constructor(private readonly userService: DomainUserService) {}

    async execute(registerDto: RegisterDto) {
        const user = await this.userService.findUserByEmail(registerDto.email);
        if (user) {
            throw new BadRequestException('이미 존재하는 이메일입니다.');
        }
        return this.userService.createUser(registerDto);
    }
}
