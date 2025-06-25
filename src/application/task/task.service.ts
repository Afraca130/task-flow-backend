import { Injectable } from '@nestjs/common';
import {
    CreateTaskUseCase,
    GetTasksUseCase,
    GetTaskUseCase,
    GetTasksByProjectUseCase,
    GetTasksByProjectAndStatusUseCase,
    UpdateTaskUseCase,
    UpdateTaskStatusUseCase,
    DeleteTaskUseCase,
} from './usecases';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, GetTasksQueryDto, TaskResponseDto } from './dtos';
import { TaskStatus } from '@src/common/enums/task-status.enum';

@Injectable()
export class TaskService {
    constructor(
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly getTasksUseCase: GetTasksUseCase,
        private readonly getTaskUseCase: GetTaskUseCase,
        private readonly getTasksByProjectUseCase: GetTasksByProjectUseCase,
        private readonly getTasksByProjectAndStatusUseCase: GetTasksByProjectAndStatusUseCase,
        private readonly updateTaskUseCase: UpdateTaskUseCase,
        private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
        private readonly deleteTaskUseCase: DeleteTaskUseCase,
    ) {}

    async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<TaskResponseDto> {
        return this.createTaskUseCase.execute(createTaskDto, userId);
    }

    async getTasks(
        query: GetTasksQueryDto,
    ): Promise<{ data: TaskResponseDto[]; total: number; page: number; limit: number; totalPages: number }> {
        return this.getTasksUseCase.execute(query);
    }

    async getTask(taskId: string, userId: string): Promise<TaskResponseDto> {
        return this.getTaskUseCase.execute(taskId, userId);
    }

    async getTasksByProject(projectId: string, userId: string): Promise<TaskResponseDto[]> {
        return this.getTasksByProjectUseCase.execute(projectId, userId);
    }

    async getTasksByProjectAndStatus(
        projectId: string,
        status: TaskStatus,
        page: number,
        limit: number,
        userId: string,
    ): Promise<{ data: TaskResponseDto[]; meta: any }> {
        return this.getTasksByProjectAndStatusUseCase.execute(projectId, status, page, limit, userId);
    }

    async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskResponseDto> {
        return this.updateTaskUseCase.execute(taskId, updateTaskDto, userId);
    }

    async updateTaskStatus(
        taskId: string,
        updateStatusDto: UpdateTaskStatusDto,
        userId: string,
    ): Promise<TaskResponseDto> {
        return this.updateTaskStatusUseCase.execute(taskId, updateStatusDto, userId);
    }

    async deleteTask(taskId: string, userId: string): Promise<void> {
        return this.deleteTaskUseCase.execute(taskId, userId);
    }
}
