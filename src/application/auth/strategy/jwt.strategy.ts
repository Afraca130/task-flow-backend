import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DomainUserService } from '@src/domain/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: DomainUserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET') || 'default-secret-key',
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findUserByEmail(payload.email);
        if (!user || user.email !== payload.email) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
