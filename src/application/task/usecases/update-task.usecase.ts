import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

@Injectable()
export class UpdateTaskUseCase {
    private readonly logger = new Logger(UpdateTaskUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskResponseDto> {
        this.logger.log(`Updating task: ${taskId} by user: ${userId}`);

        // 태스크 존재 확인
        const existingTask = await this.taskService.findOne({
            where: { id: taskId },
        });

        if (!existingTask) {
            throw new NotFoundException('태스크를 찾을 수 없습니다.');
        }

        // 사용자 정보 조회
        const user = await this.userService.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인
        const hasPermission = await this.projectMemberService.hasPermission(
            existingTask.projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('해당 태스크를 수정할 권한이 없습니다.');
        }

        // 담당자 검증 (담당자가 변경되는 경우)
        if (updateTaskDto.assigneeId && updateTaskDto.assigneeId !== existingTask.assigneeId) {
            const assignee = await this.userService.findOne({
                where: { id: updateTaskDto.assigneeId },
            });

            if (!assignee) {
                throw new NotFoundException('지정된 담당자를 찾을 수 없습니다.');
            }

            const assigneeIsMember = await this.projectMemberService.hasPermission(
                existingTask.projectId,
                updateTaskDto.assigneeId,
                ProjectMemberRole.MEMBER,
            );

            if (!assigneeIsMember) {
                throw new ForbiddenException('담당자가 해당 프로젝트의 멤버가 아닙니다.');
            }
        }

        // 변경사항 추적
        const changes: string[] = [];
        const metadata: Record<string, any> = {};

        if (updateTaskDto.title && updateTaskDto.title !== existingTask.title) {
            changes.push(`제목: "${existingTask.title}" → "${updateTaskDto.title}"`);
            metadata.oldTitle = existingTask.title;
            metadata.newTitle = updateTaskDto.title;
        }

        if (updateTaskDto.description !== undefined && updateTaskDto.description !== existingTask.description) {
            changes.push('설명 변경');
            metadata.oldDescription = existingTask.description;
            metadata.newDescription = updateTaskDto.description;
        }

        if (updateTaskDto.priority && updateTaskDto.priority !== existingTask.priority) {
            changes.push(`우선순위: ${existingTask.priority} → ${updateTaskDto.priority}`);
            metadata.oldPriority = existingTask.priority;
            metadata.newPriority = updateTaskDto.priority;
        }

        if (updateTaskDto.status && updateTaskDto.status !== existingTask.status) {
            changes.push(`상태: ${existingTask.status} → ${updateTaskDto.status}`);
            metadata.oldStatus = existingTask.status;
            metadata.newStatus = updateTaskDto.status;
        }

        if (updateTaskDto.assigneeId !== undefined && updateTaskDto.assigneeId !== existingTask.assigneeId) {
            const oldAssignee = existingTask.assigneeId
                ? await this.userService.findOne({ where: { id: existingTask.assigneeId } })
                : null;
            const newAssignee = updateTaskDto.assigneeId
                ? await this.userService.findOne({ where: { id: updateTaskDto.assigneeId } })
                : null;

            changes.push(`담당자: ${oldAssignee?.name || '미지정'} → ${newAssignee?.name || '미지정'}`);
            metadata.oldAssigneeId = existingTask.assigneeId;
            metadata.newAssigneeId = updateTaskDto.assigneeId;
            metadata.oldAssigneeName = oldAssignee?.name;
            metadata.newAssigneeName = newAssignee?.name;
        }

        // 태스크 업데이트
        const updateData: any = { ...updateTaskDto };
        if (updateTaskDto.dueDate) {
            updateData.dueDate = new Date(updateTaskDto.dueDate);
        }
        const updatedTask = await this.taskService.update(taskId, updateData);

        // Activity Log 기록 (변경사항이 있는 경우만)
        if (changes.length > 0) {
            try {
                const description = `${user.name}님이 "${existingTask.title}" 작업을 수정했습니다: ${changes.join(', ')}`;
                await this.activityLogService.logActivity(
                    userId,
                    existingTask.projectId,
                    taskId,
                    ActivityEntityType.TASK,
                    'UPDATED',
                    description,
                    metadata,
                );
            } catch (error) {
                this.logger.error('Failed to log task update activity', error);
            }
        }

        // 관계 정보와 함께 태스크 조회
        const taskWithRelations = await this.taskService.getTaskWithRelations(updatedTask.id);

        this.logger.log(`Task updated successfully: ${taskId}`);

        return plainToInstance(TaskResponseDto, taskWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
