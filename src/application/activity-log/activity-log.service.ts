import { Injectable } from '@nestjs/common';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

@Injectable()
export class ActivityLogService {
    constructor(private readonly domainActivityLogService: DomainActivityLogService) {}

    // 활동 로그 생성을 위한 헬퍼 메서드들
    async logTaskCreated(userId: string, projectId: string, taskId: string, taskTitle: string): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            taskId,
            ActivityEntityType.TASK,
            'CREATE',
            `새 태스크 "${taskTitle}"를 생성했습니다.`,
            { taskTitle },
        );
    }

    async logTaskUpdated(
        userId: string,
        projectId: string,
        taskId: string,
        taskTitle: string,
        changes: Record<string, any>,
    ): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            taskId,
            ActivityEntityType.TASK,
            'UPDATE',
            `태스크 "${taskTitle}"를 수정했습니다.`,
            { taskTitle, changes },
        );
    }

    async logTaskDeleted(userId: string, projectId: string, taskId: string, taskTitle: string): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            taskId,
            ActivityEntityType.TASK,
            'DELETE',
            `태스크 "${taskTitle}"를 삭제했습니다.`,
            { taskTitle },
        );
    }

    async logProjectUpdated(
        userId: string,
        projectId: string,
        projectName: string,
        changes: Record<string, any>,
    ): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            projectId,
            ActivityEntityType.PROJECT,
            'UPDATE',
            `프로젝트 "${projectName}" 정보를 수정했습니다.`,
            { projectName, changes },
        );
    }

    async logMemberAdded(
        userId: string,
        projectId: string,
        newMemberId: string,
        memberName: string,
        role: string,
    ): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            newMemberId,
            ActivityEntityType.PROJECT_MEMBER,
            'ADD',
            `새 멤버 "${memberName}"를 ${role} 역할로 추가했습니다.`,
            { memberName, role },
        );
    }

    async logMemberRemoved(
        userId: string,
        projectId: string,
        removedMemberId: string,
        memberName: string,
    ): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            removedMemberId,
            ActivityEntityType.PROJECT_MEMBER,
            'REMOVE',
            `멤버 "${memberName}"를 프로젝트에서 제거했습니다.`,
            { memberName },
        );
    }

    async logIssueCreated(userId: string, projectId: string, issueId: string, issueTitle: string): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            issueId,
            ActivityEntityType.ISSUE,
            'CREATE',
            `새 이슈 "${issueTitle}"를 생성했습니다.`,
            { issueTitle },
        );
    }

    async logCommentAdded(
        userId: string,
        projectId: string,
        commentId: string,
        entityType: string,
        entityTitle: string,
    ): Promise<void> {
        await this.domainActivityLogService.logActivity(
            userId,
            projectId,
            commentId,
            ActivityEntityType.COMMENT,
            'CREATE',
            `${entityType} "${entityTitle}"에 댓글을 작성했습니다.`,
            { entityType, entityTitle },
        );
    }
}
