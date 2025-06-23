import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@src/domain/entities/user.entity';
import { BaseService } from '@src/common/services/base.service';
import { DomainUserRepository } from './user.repository';
import { RegisterDto } from '@src/dtos.index';

@Injectable()
export class DomainUserService extends BaseService<User> {
    constructor(private readonly userRepository: DomainUserRepository) {
        super(userRepository);
    }

    async createUser(userDto: RegisterDto): Promise<User> {
        const user = await this.userRepository.create(userDto);
        return this.userRepository.save(user);
    }

    async findUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }
}
