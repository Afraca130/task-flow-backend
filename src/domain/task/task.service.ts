import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { Task } from '../entities/task.entity';
import { DomainTaskRepository, TaskFilterOptions } from './task.repository';
import { TaskStatus } from '@src/common/enums/task-status.enum';
import { TaskPriority } from '@src/common/enums/task-priority.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainTaskService extends BaseService<Task> {
    constructor(private readonly taskRepository: DomainTaskRepository) {
        super(taskRepository);
    }

    async createTask(
        title: string,
        projectId: string,
        assignerId: string,
        options?: {
            description?: string;
            priority?: TaskPriority;
            status?: TaskStatus;
            assigneeId?: string;
            dueDate?: Date;
            tags?: string[];
            repositoryOptions?: IRepositoryOptions<Task>;
        },
    ): Promise<Task> {
        const lexoRank = await this.taskRepository.getNextLexoRank(projectId, options?.repositoryOptions);

        const taskData = {
            title,
            projectId,
            assignerId,
            lexoRank,
            description: options?.description,
            priority: options?.priority || TaskPriority.MEDIUM,
            status: options?.status || TaskStatus.TODO,
            assigneeId: options?.assigneeId,
            dueDate: options?.dueDate,
            tags: options?.tags,
        };

        return this.save(taskData, options?.repositoryOptions);
    }

    async getTasksByProject(projectId: string, options?: IRepositoryOptions<Task>): Promise<Task[]> {
        return this.taskRepository.findByProjectId(projectId, options);
    }

    async getTasksByProjectAndStatus(
        projectId: string,
        status: TaskStatus,
        page: number = 1,
        limit: number = 20,
        options?: IRepositoryOptions<Task>,
    ): Promise<{ data: Task[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
        const [tasks, total] = await this.taskRepository.findByProjectAndStatus(
            projectId,
            status,
            page,
            limit,
            options,
        );

        return {
            data: tasks,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getTasksWithFilters(
        filters: TaskFilterOptions,
        options?: IRepositoryOptions<Task>,
    ): Promise<{ data: Task[]; total: number; page: number; limit: number; totalPages: number }> {
        const [tasks, total] = await this.taskRepository.findWithFilters(filters, options);
        const page = filters.page || 1;
        const limit = filters.limit || 20;

        return {
            data: tasks,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateTaskStatus(taskId: string, status: TaskStatus, options?: IRepositoryOptions<Task>): Promise<Task> {
        return this.update(taskId, { status }, options);
    }

    async assignTask(taskId: string, assigneeId: string, options?: IRepositoryOptions<Task>): Promise<Task> {
        return this.update(taskId, { assigneeId }, options);
    }

    async getTaskWithRelations(taskId: string, options?: IRepositoryOptions<Task>): Promise<Task | null> {
        return this.findOne({
            where: { id: taskId },
            relations: ['assignee', 'assigner', 'project'],
            ...options,
        });
    }

    async countTasksByProject(projectId: string, options?: IRepositoryOptions<Task>): Promise<number> {
        return this.taskRepository.countByProjectId(projectId, options);
    }
}
