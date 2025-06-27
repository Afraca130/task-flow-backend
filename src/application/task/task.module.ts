import { Module } from '@nestjs/common';
import { DomainTaskModule } from '@src/domain/task/task.module';
import { DomainProjectModule } from '@src/domain/project/project.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { DomainUserModule } from '@src/domain/user/user.module';
import { DomainNotificationModule } from '@src/domain/notification/notification.module';
import { DomainActivityLogModule } from '@src/domain/activity-log/activity-log.module';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './task.service';
import {
    CreateTaskUseCase,
    GetTasksUseCase,
    GetTaskUseCase,
    GetTasksByProjectUseCase,
    GetTasksByProjectAndStatusUseCase,
    UpdateTaskUseCase,
    UpdateTaskStatusUseCase,
    DeleteTaskUseCase,
} from './usecases';

@Module({
    imports: [
        DomainTaskModule,
        DomainProjectModule,
        DomainProjectMemberModule,
        DomainUserModule,
        DomainNotificationModule,
        DomainActivityLogModule,
    ],
    controllers: [TaskController],
    providers: [
        TaskService,
        CreateTaskUseCase,
        GetTasksUseCase,
        GetTaskUseCase,
        GetTasksByProjectUseCase,
        GetTasksByProjectAndStatusUseCase,
        UpdateTaskUseCase,
        UpdateTaskStatusUseCase,
        DeleteTaskUseCase,
    ],
    exports: [TaskService],
})
export class TaskModule {}
