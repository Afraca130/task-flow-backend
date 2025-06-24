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

        const where: FindOptionsWhere<Project> = {
            isPublic,
        };

        const options: IRepositoryOptions<Project> = {
            where,
            order: {
                createdAt: 'DESC',
            },
            skip: offset,
        };

        options.skip = (page - 1) * limit;
        options.take = limit;

        const [projects, total] = await this.projectService.getProjects(options);

        return {
            data: projects.map((project) => {
                return plainToInstance(ProjectResponseDto, project);
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
