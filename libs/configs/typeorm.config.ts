import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    return {
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        schema: 'public',
        // synchronize: configService.get('NODE_ENV') === 'local',
        // logging: configService.get('NODE_ENV') === 'local',
        migrations: [join(__dirname, 'libs/migrations/*.ts')],
        migrationsRun: configService.get('database.port') === 6543,
        ssl: configService.get('database.port') === 6543,
        extra: {
            ssl: configService.get('database.port') === 6543 ? { rejectUnauthorized: false } : null,
        },
    };
};
