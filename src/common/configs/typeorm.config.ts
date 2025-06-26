import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env 파일 수동 로드 (백업)
try {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
    console.log('✅ .env file loaded manually');
} catch (error) {
    console.log('❌ Failed to load .env file manually:', error.message);
}

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    // PostgreSQL URL 및 환경 설정
    const postgresUrl = configService.get('POSTGRES_URL');
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';

    // PostgreSQL URL에 SSL 비활성화 파라미터 추가 (self-signed certificate 오류 해결)
    let connectionUrl = postgresUrl;
    if (postgresUrl && isProduction) {
        // 기존 쿼리 파라미터 제거 후 SSL 비활성화 파라미터 추가
        const baseUrl = postgresUrl.split('?')[0];

        // SSL 비활성화 파라미터 (Vercel 환경에서 self-signed certificate 오류 방지)
        const sslParams = 'sslmode=disable';

        connectionUrl = `${baseUrl}?${sslParams}`;

        console.log('🔒 PostgreSQL SSL disabled for production (self-signed certificate fix)');
    }

    // ConfigService fallback to process.env
    const getConfig = (key: string, defaultValue?: string) => {
        const configValue = configService.get(key);
        const envValue = process.env[key];
        return configValue || envValue || defaultValue;
    };

    const dbConfig: TypeOrmModuleOptions = {
        url: connectionUrl,
        type: 'postgres' as const,
        port: parseInt(getConfig('POSTGRES_PORT', '5432')),
        username: getConfig('POSTGRES_USER'),
        password: getConfig('POSTGRES_PASSWORD'),
        database: getConfig('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        entities: [__dirname + '/../../domain/entities/*.entity{.ts,.js}'],
        synchronize: true,
        // logging: isDevelopment,
        ssl: false, // SSL 완전 비활성화
        extra: {
            max: 20,
            connectionTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            ssl: false, // 연결 풀에서도 SSL 비활성화
        },
    };

    // 데이터베이스 설정값 로그 출력
    console.log('🔗 Database Configuration:');
    console.log('  Environment:', process.env.NODE_ENV || 'undefined');
    console.log('  POSTGRES_URL:', configService.get('POSTGRES_URL') || 'undefined');
    console.log('  Connection URL:', connectionUrl ? 'Configured ✅' : 'Not Set ❌');
    console.log('  Username:', dbConfig.username || 'undefined');
    console.log('  Password:', dbConfig.password ? '***' + String(dbConfig.password).slice(-3) : 'undefined');
    console.log('  Database:', dbConfig.database || 'undefined');
    console.log('  Synchronize:', dbConfig.synchronize);
    console.log('  Logging:', dbConfig.logging);
    console.log('  SSL Enabled:', '❌ Disabled (self-signed certificate fix)');
    console.log('  SSL Mode:', isProduction ? 'sslmode=disable' : 'No SSL');
    console.log('  Connection Pool Max:', dbConfig.extra.max);
    console.log('  Connection Timeout:', dbConfig.extra.connectionTimeoutMillis + 'ms');
    console.log('  Security Level:', isProduction ? 'Production (No SSL for compatibility)' : 'Development (No SSL)');

    return dbConfig;
};
