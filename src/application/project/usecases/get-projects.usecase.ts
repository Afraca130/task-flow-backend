import { Injectable } from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { ProjectResponseDto } from '@src/application/project/dtos';
import { plainToInstance } from 'class-transformer';
import { GetPaginatedProjectQueryDto } from '../dtos/get-paginated-project.query.dto';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';
import { Project } from '@src/domain/entities/project.entity';
import { FindOptionsWhere } from 'typeorm';
import { PaginationData } from '@src/common/dtos/paginate-response.dto';

@Injectable()
export class GetProjectsUseCase {
    constructor(private readonly projectService: DomainProjectService) {}

    async execute(query: GetPaginatedProjectQueryDto): Promise<PaginationData<ProjectResponseDto>> {
        const { page, limit, isPublic } = query;
        const offset = (page - 1) * limit;

        const where: FindOptionsWhere<Project> = {};

        // isActive가 true인 프로젝트만 조회
        where.isActive = true;

        if (isPublic !== undefined) {
            where.isPublic = isPublic;
        }

        const options: IRepositoryOptions<Project> = {
            where,
            relations: ['owner', 'members', 'tasks'],
            order: {
                createdAt: 'DESC',
            },
            skip: offset,
            take: limit,
        };

        const [projects, total] = await this.projectService.findAndCount(options);

        return {
            data: projects.map((project) => {
                const response = plainToInstance(ProjectResponseDto, project);
                response.memberCount = project.members?.length || 0;
                response.taskCount = project.tasks?.length || 0;
                return response;
            }),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
