import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

@Injectable()
export class DeleteTaskUseCase {
    private readonly logger = new Logger(DeleteTaskUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(taskId: string, userId: string): Promise<void> {
        this.logger.log(`Deleting task: ${taskId} by user: ${userId}`);

        // 태스크 존재 확인
        const task = await this.taskService.findOne({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundException('태스크를 찾을 수 없습니다.');
        }

        // 사용자 정보 조회
        const user = await this.userService.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인 (매니저 이상만 삭제 가능)
        const hasPermission = await this.projectMemberService.hasPermission(
            task.projectId,
            userId,
            ProjectMemberRole.MANAGER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('해당 태스크를 삭제할 권한이 없습니다. 매니저 이상의 권한이 필요합니다.');
        }

        // 태스크 삭제
        await this.taskService.delete(taskId);

        // Activity Log 기록
        try {
            await this.activityLogService.logActivity(
                userId,
                task.projectId,
                taskId,
                ActivityEntityType.TASK,
                'DELETED',
                `${user.name}님이 "${task.title}" 작업을 삭제했습니다.`,
                {
                    taskTitle: task.title,
                    taskPriority: task.priority,
                    taskStatus: task.status,
                    assigneeId: task.assigneeId,
                },
            );
        } catch (error) {
            this.logger.error('Failed to log task deletion activity', error);
        }

        this.logger.log(`Task deleted successfully: ${taskId}`);
    }
}
