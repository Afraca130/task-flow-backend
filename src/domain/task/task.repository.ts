import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '@src/common/enums/task-status.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

export interface TaskFilterOptions {
    projectId?: string;
    assigneeId?: string;
    status?: TaskStatus;
    search?: string;
    page?: number;
    limit?: number;
}

@Injectable()
export class DomainTaskRepository extends BaseRepository<Task> {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {
        super(taskRepository);
    }

    async findByProjectId(projectId: string, options?: IRepositoryOptions<Task>): Promise<Task[]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.find({
            where: { projectId },
            relations: ['assignee', 'assigner', 'project'],
            order: { lexoRank: 'ASC' },
            ...options,
        });
    }

    async findByProjectAndStatus(
        projectId: string,
        status: TaskStatus,
        page: number = 1,
        limit: number = 20,
        options?: IRepositoryOptions<Task>,
    ): Promise<[Task[], number]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        const skip = (page - 1) * limit;

        return repository.findAndCount({
            where: { projectId, status },
            relations: ['assignee', 'assigner', 'project'],
            order: { lexoRank: 'ASC' },
            skip,
            take: limit,
            ...options,
        });
    }

    async findWithFilters(filters: TaskFilterOptions, options?: IRepositoryOptions<Task>): Promise<[Task[], number]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        const { projectId, assigneeId, status, search, page = 1, limit = 20 } = filters;
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Task> = {};

        if (projectId) where.projectId = projectId;
        if (assigneeId) where.assigneeId = assigneeId;
        if (status) where.status = status;

        // 검색 기능 (title 또는 description에서 검색)
        if (search) {
            const searchConditions = [
                { ...where, title: Like(`%${search}%`) },
                { ...where, description: Like(`%${search}%`) },
            ];

            return repository.findAndCount({
                where: searchConditions,
                relations: ['assignee', 'assigner', 'project'],
                order: { lexoRank: 'ASC' },
                skip,
                take: limit,
                ...options,
            });
        }

        return repository.findAndCount({
            where,
            relations: ['assignee', 'assigner', 'project'],
            order: { lexoRank: 'ASC' },
            skip,
            take: limit,
            ...options,
        });
    }

    async countByProjectId(projectId: string, options?: IRepositoryOptions<Task>): Promise<number> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.count({
            where: { projectId },
        });
    }

    async getNextLexoRank(projectId: string, options?: IRepositoryOptions<Task>): Promise<string> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        const lastTask = await repository.findOne({
            where: { projectId },
            order: { lexoRank: 'DESC' },
            select: ['lexoRank'],
        });

        // 간단한 lexoRank 생성 로직 (실제로는 더 복잡한 lexoRank 라이브러리 사용 권장)
        if (!lastTask) {
            return 'n';
        }

        const lastRank = lastTask.lexoRank;
        const nextChar = String.fromCharCode(lastRank.charCodeAt(lastRank.length - 1) + 1);
        return lastRank.slice(0, -1) + nextChar;
    }
}
