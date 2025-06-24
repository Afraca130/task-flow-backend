import { Module } from '@nestjs/common';
import { DomainProjectModule } from '@src/domain/project/project.module';
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
    imports: [DomainProjectModule],
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
