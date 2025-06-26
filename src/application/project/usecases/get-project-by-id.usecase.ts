import { Injectable } from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { ProjectResponseDto } from '../dtos/project-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetProjectByIdUseCase {
    constructor(private readonly projectService: DomainProjectService) {}

    async execute(projectId: string): Promise<ProjectResponseDto | null> {
        const project = await this.projectService.getProjectWithCounts(projectId);

        if (!project) {
            return null;
        }

        const response = plainToInstance(ProjectResponseDto, project);

        // memberCount 계산
        response.memberCount = project.members?.length || 0;

        // taskCount는 별도 서비스를 통해 계산 (circular dependency 해결)
        response.taskCount = 0; // 임시로 0 설정

        return response;
    }
}
