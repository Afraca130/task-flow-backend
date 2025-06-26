import { Module } from '@nestjs/common';
import { DomainProjectModule } from '@src/domain/project/project.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { DomainUserModule } from '@src/domain/user/user.module';
import { DomainActivityLogModule } from '@src/domain/activity-log/activity-log.module';
import { ProjectController } from './controllers/project.controller';
import {
    CreateProjectUseCase,
    UpdateProjectUseCase,
    GetProjectsUseCase,
    GetProjectByIdUseCase,
    DeleteProjectUseCase,
} from './usecases';
import { ProjectService } from './project.service';

@Module({
    imports: [DomainProjectModule, DomainProjectMemberModule, DomainUserModule, DomainActivityLogModule],
    controllers: [ProjectController],
    providers: [
        ProjectService,
        CreateProjectUseCase,
        UpdateProjectUseCase,
        GetProjectsUseCase,
        GetProjectByIdUseCase,
        DeleteProjectUseCase,
    ],
    exports: [],
})
export class ProjectModule {}
