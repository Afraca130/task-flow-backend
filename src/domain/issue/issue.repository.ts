import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { Issue } from '../entities/issue.entity';
import { IssueType } from '@src/common/enums/issue-type.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

export interface IssueFilterOptions {
    projectId?: string;
    type?: IssueType;
    authorId?: string;
    search?: string;
    page?: number;
    limit?: number;
}

@Injectable()
export class DomainIssueRepository extends BaseRepository<Issue> {
    constructor(
        @InjectRepository(Issue)
        private readonly issueRepository: Repository<Issue>,
    ) {
        super(issueRepository);
    }

    async findWithFilters(
        filters: IssueFilterOptions,
        options?: IRepositoryOptions<Issue>,
    ): Promise<[Issue[], number]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        const { projectId, type, authorId, search, page = 1, limit = 20 } = filters;
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Issue> = {};

        if (projectId) where.projectId = projectId;
        if (type) where.type = type;
        if (authorId) where.authorId = authorId;

        // 검색 기능 (title 또는 description에서 검색)
        if (search) {
            const searchConditions = [
                { ...where, title: Like(`%${search}%`) },
                { ...where, description: Like(`%${search}%`) },
            ];

            return repository.findAndCount({
                where: searchConditions,
                relations: ['author', 'project'],
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
                ...options,
            });
        }

        return repository.findAndCount({
            where,
            relations: ['author', 'project'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
            ...options,
        });
    }

    async findByIdWithRelations(id: string, options?: IRepositoryOptions<Issue>): Promise<Issue | null> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.findOne({
            where: { id },
            relations: ['author', 'project'],
            ...options,
        });
    }
}
