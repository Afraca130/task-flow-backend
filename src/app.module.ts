import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { TerminusModule } from '@nestjs/terminus';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './common/configs/jwt.config';
import { AuthModule } from './application/auth/auth.module';
import { ProjectModule } from './application/project/project.module';
import { InvitationModule } from './application/invitation/invitation.module';
import { ProjectMemberModule } from './application/project-member/project-member.module';
import { NotificationModule } from './application/notification/notification.module';
import { IssueModule } from './application/issue/issue.module';
import { ActivityLogModule } from './application/activity-log/activity-log.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => typeOrmConfig(configService),
            inject: [ConfigService],
        }),
        JwtModule.registerAsync({
            global: true,
            useFactory: jwtConfig,
            inject: [ConfigService],
        }),
        TerminusModule,
        AuthModule,
        ProjectModule,
        InvitationModule,
        ProjectMemberModule,
        NotificationModule,
        IssueModule,
        ActivityLogModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
