import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    return {
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        // synchronize: configService.get('NODE_ENV') === 'local',
        synchronize: true,
        // logging: configService.get('NODE_ENV') === 'local',
        migrationsRun: configService.get('POSTGRES_PORT') === 5432,
        ssl: configService.get('POSTGRES_PORT') === 5432,
        extra: {
            ssl: configService.get('POSTGRES_PORT') === 5432 ? { rejectUnauthorized: false } : null,
        },
    };
};
