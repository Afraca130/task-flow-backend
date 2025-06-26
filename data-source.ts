import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST') || 'localhost',
    port: parseInt(configService.get('POSTGRES_PORT') || '5432'),
    username: configService.get('POSTGRES_USER') || 'postgres',
    password: configService.get('POSTGRES_PASSWORD') || 'password',
    database: configService.get('POSTGRES_DATABASE') || 'taskflow',
    entities: ['src/domain/entities/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
