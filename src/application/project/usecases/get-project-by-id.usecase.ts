import { Injectable } from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { ProjectResponseDto } from '../dtos/project-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetProjectByIdUseCase {
    constructor(private readonly projectService: DomainProjectService) {}

    async execute(projectId: string): Promise<ProjectResponseDto | null> {
        const project = await this.projectService.findOne({
            where: { id: projectId } as any,
            relations: ['owner'],
        });

        if (!project) {
            return null;
        }

        return plainToInstance(ProjectResponseDto, project);
    }
}
