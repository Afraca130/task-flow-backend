import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get<string>('SUPABASE_JWT_SECRET'),
    signOptions: {
        expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        issuer: configService.get<string>('JWT_ISSUER', 'your-app'),
        audience: configService.get<string>('JWT_AUDIENCE', 'your-users'),
    },
    verifyOptions: {
        ignoreExpiration: false,
        ignoreNotBefore: false,
    },
});
