import { ProjectResponseDto } from '@/application/project/dtos';
import { PaginationData } from '@/common/dtos';
import { IRepositoryOptions } from '@/common/interfaces/repository.interface';
import { User } from '@/domain/entities/user.entity';
import { DomainUserService } from '@/domain/user/user.service';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetUserProjectsUseCase {
    constructor(private readonly userService: DomainUserService) {}

    async execute(userId: string): Promise<PaginationData<ProjectResponseDto>> {
        const options: IRepositoryOptions<User> = {
            where: {
                id: userId,
            },
            relations: ['projects'],
        };

        const user = await this.userService.findOne(options);
        const projects = user.projects;

        return {
            data: projects.map((project) => {
                return plainToInstance(ProjectResponseDto, project);
            }),

            meta: {
                total: user.projects.length,
                page: 1,
                limit: user.projects.length,
                totalPages: Math.ceil(user.projects.length / user.projects.length),
            },
        };
    }
}
