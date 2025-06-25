import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class GetTaskUseCase {
    private readonly logger = new Logger(GetTaskUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(taskId: string, userId: string): Promise<TaskResponseDto> {
        this.logger.log(`Getting task: ${taskId} by user: ${userId}`);

        const task = await this.taskService.getTaskWithRelations(taskId);

        if (!task) {
            throw new NotFoundException('태스크를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인
        const hasPermission = await this.projectMemberService.hasPermission(
            task.projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('해당 태스크를 조회할 권한이 없습니다.');
        }

        return plainToInstance(TaskResponseDto, task, {
            excludeExtraneousValues: true,
        });
    }
}
