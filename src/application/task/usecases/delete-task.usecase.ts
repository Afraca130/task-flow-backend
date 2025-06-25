import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class DeleteTaskUseCase {
    private readonly logger = new Logger(DeleteTaskUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(taskId: string, userId: string): Promise<void> {
        this.logger.log(`Deleting task: ${taskId} by user: ${userId}`);

        const task = await this.taskService.findOne({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundException('태스크를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인 (매니저 이상 또는 태스크 생성자)
        const isManager = await this.projectMemberService.hasPermission(
            task.projectId,
            userId,
            ProjectMemberRole.MANAGER,
        );

        const isCreator = task.assignerId === userId;

        if (!isManager && !isCreator) {
            throw new ForbiddenException('해당 태스크를 삭제할 권한이 없습니다.');
        }

        await this.taskService.delete(taskId);

        this.logger.log(`Task deleted successfully: ${taskId}`);
    }
}
