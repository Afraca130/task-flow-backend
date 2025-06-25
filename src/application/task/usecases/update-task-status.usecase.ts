import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { UpdateTaskStatusDto } from '../dtos/update-task-status.dto';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class UpdateTaskStatusUseCase {
    private readonly logger = new Logger(UpdateTaskStatusUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(taskId: string, updateStatusDto: UpdateTaskStatusDto, userId: string): Promise<TaskResponseDto> {
        this.logger.log(`Updating task status: ${taskId} to ${updateStatusDto.status} by user: ${userId}`);

        const task = await this.taskService.findOne({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundException('태스크를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인 (프로젝트 멤버, 담당자 또는 생성자)
        const isMember = await this.projectMemberService.hasPermission(
            task.projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        const isAssignee = task.assigneeId === userId;
        const isCreator = task.assignerId === userId;

        if (!isMember && !isAssignee && !isCreator) {
            throw new ForbiddenException('해당 태스크의 상태를 변경할 권한이 없습니다.');
        }

        const updatedTask = await this.taskService.updateTaskStatus(taskId, updateStatusDto.status);

        // 관계 정보와 함께 태스크 조회
        const taskWithRelations = await this.taskService.getTaskWithRelations(updatedTask.id);

        if (!taskWithRelations) {
            throw new Error('업데이트된 태스크를 조회할 수 없습니다.');
        }

        this.logger.log(`Task status updated successfully: ${taskId} to ${updateStatusDto.status}`);

        return plainToInstance(TaskResponseDto, taskWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
