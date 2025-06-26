import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './application/auth/auth.module';
import { ProjectModule } from './application/project/project.module';
import { TaskModule } from './application/task/task.module';
import { CommentModule } from './application/comment/comment.module';
import { InvitationModule } from './application/invitation/invitation.module';
import { ProjectMemberModule } from './application/project-member/project-member.module';
import { NotificationModule } from './application/notification/notification.module';
import { IssueModule } from './application/issue/issue.module';
import { ActivityLogModule } from './application/activity-log/activity-log.module';
import { UserModule } from './application/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            ignoreEnvFile: false,
            cache: false, // 캐시 비활성화로 실시간 로딩
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => typeOrmConfig(configService),
            inject: [ConfigService],
        }),
        TerminusModule,
        AuthModule,
        UserModule,
        ProjectModule,
        TaskModule,
        CommentModule,
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
