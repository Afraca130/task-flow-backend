import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    const dbConfig = {
        url: configService.get('POSTGRES_URL'),
        type: 'postgres' as const,
        // host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        entities: [__dirname + '/../../domain/entities/*.entity{.ts,.js}'],
        // 개발 환경에서는 synchronize 사용, 프로덕션에서는 마이그레이션 사용
        // synchronize: configService.get('NODE_ENV') !== 'production',
        synchronize: true,
        // migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        // migrationsRun: configService.get('NODE_ENV') === 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false, sslmode: 'require' } : false,
        extra: {
            max: 10,
            connectionTimeoutMillis: 10000,
        },
    };

    // 데이터베이스 설정값 로그 출력
    console.log('🔗 Database Configuration:');
    // console.log('  Host:', dbConfig.host || 'undefined');
    console.log('  Port:', dbConfig.port || 'undefined');
    console.log('  URL:', process.env.NODE_ENV || 'undefined');
    console.log('  Username:', dbConfig.username || 'undefined');
    console.log('  Password:', dbConfig.password ? '***' + dbConfig.password.slice(-3) : 'undefined');
    console.log('  Database:', dbConfig.database || 'undefined');
    console.log('  NODE_ENV:', configService.get('NODE_ENV') || 'undefined');
    console.log('  Synchronize:', dbConfig.synchronize);
    console.log('  Logging:', dbConfig.logging);
    console.log('  SSL:', dbConfig.ssl);
    console.log('  Entities Path:', dbConfig.entities);
    // console.log('  Migrations Run:', dbConfig.migrationsRun);
    // console.log('  Migrations Path:', dbConfig.migrations);

    return dbConfig;
};
