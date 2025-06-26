import { Injectable } from '@nestjs/common';
import { PaginationData } from '@src/common/dtos/paginate-response.dto';
import {
    CreateProjectUseCase,
    DeleteProjectUseCase,
    GetProjectByIdUseCase,
    GetProjectsUseCase,
    UpdateProjectUseCase,
} from './usecases';
import {
    CreateProjectDto,
    GetPaginatedProjectQueryDto,
    ProjectResponseDto,
    UpdateProjectDto,
} from '@src/application/project/dtos';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ProjectService {
    constructor(
        private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
        private readonly getProjectsUseCase: GetProjectsUseCase,
        private readonly createProjectUseCase: CreateProjectUseCase,
        private readonly updateProjectUseCase: UpdateProjectUseCase,
        private readonly deleteProjectUseCase: DeleteProjectUseCase,
    ) {}

    async getProjects(query: GetPaginatedProjectQueryDto): Promise<PaginationData<ProjectResponseDto>> {
        return this.getProjectsUseCase.execute(query);
    }

    async getProjectById(projectId: string): Promise<ProjectResponseDto> {
        const project = await this.getProjectByIdUseCase.execute(projectId);
        return this.getProjectByIdUseCase.execute(projectId);
    }

    async createProject(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectResponseDto> {
        return this.createProjectUseCase.execute(createProjectDto, userId);
    }

    async updateProject(
        projectId: string,
        updateProjectDto: UpdateProjectDto,
        userId: string,
    ): Promise<ProjectResponseDto> {
        return this.updateProjectUseCase.execute(projectId, updateProjectDto, userId);
    }

    async deleteProject(projectId: string, userId: string): Promise<DeleteResult> {
        return this.deleteProjectUseCase.execute(projectId, userId);
    }
}
