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

// 안전한 컨트롤러 로딩 함수
function safeLoadController(controllerPath: string, controllerName: string) {
    try {
        const controller = require(controllerPath)[controllerName];
        if (controller && controller.name) {
            console.log(`✅ ${controllerName} loaded successfully`);
            return controller;
        } else {
            console.warn(`⚠️ ${controllerName} is undefined or invalid`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Failed to load ${controllerName}:`, error.message);
        return null;
    }
}

// 컨트롤러들을 안전하게 로딩
const controllers = [
    safeLoadController('./application/user/controllers/user.controller', 'UserController'),
    safeLoadController('./application/project/controllers/project.controller', 'ProjectController'),
    safeLoadController('./application/task/controllers/task.controller', 'TaskController'),
    safeLoadController('./application/comment/controllers/comment.controller', 'CommentController'),
    safeLoadController('./application/invitation/controllers/invitation.controller', 'InvitationController'),
    safeLoadController('./application/project-member/controllers/project-member.controller', 'ProjectMemberController'),
    safeLoadController('./application/notification/controllers/notification.controller', 'NotificationController'),
    safeLoadController('./application/issue/controllers/issue.controller', 'IssueController'),
    safeLoadController('./application/activity-log/controllers/activity-log.controller', 'ActivityLogController'),
    // ... 기타 컨트롤러들
].filter(Boolean); // null/undefined 제거

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
