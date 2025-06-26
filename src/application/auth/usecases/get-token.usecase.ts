import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/domain/entities/user.entity';

@Injectable()
export class GetTokenUsecase {
    constructor(private readonly jwtService: JwtService) {}

    async execute(user: User): Promise<string> {
        const payload = {
            sub: user.id,
            email: user.email,
            type: 'access',
        };

        const accessToken = this.jwtService.sign(payload);

        return accessToken;
    }
}
