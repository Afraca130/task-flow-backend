import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { GetTasksQueryDto } from '../dtos/get-tasks-query.dto';
import { TaskResponseDto } from '../dtos/task-response.dto';

@Injectable()
export class GetTasksUseCase {
    private readonly logger = new Logger(GetTasksUseCase.name);

    constructor(private readonly taskService: DomainTaskService) {}

    async execute(
        query: GetTasksQueryDto,
    ): Promise<{ data: TaskResponseDto[]; total: number; page: number; limit: number; totalPages: number }> {
        this.logger.log(`Getting tasks with filters: ${JSON.stringify(query)}`);

        const result = await this.taskService.getTasksWithFilters(query);

        const taskDtos = result.data.map((task) =>
            plainToInstance(TaskResponseDto, task, {
                excludeExtraneousValues: true,
            }),
        );

        return {
            data: taskDtos,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
}
