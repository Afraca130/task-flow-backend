import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

@Injectable()
export class DeleteIssueUseCase {
    private readonly logger = new Logger(DeleteIssueUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(issueId: string, userId: string): Promise<void> {
        this.logger.log(`Deleting issue: ${issueId} by user: ${userId}`);

        // 이슈 존재 확인
        const issue = await this.issueService.findOne({
            where: { id: issueId },
        });

        if (!issue) {
            throw new NotFoundException('이슈를 찾을 수 없습니다.');
        }

        // 사용자 정보 조회
        const user = await this.userService.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 권한 확인 (매니저 이상이거나 이슈 작성자)
        const hasManagerPermission = await this.projectMemberService.hasPermission(
            issue.projectId,
            userId,
            ProjectMemberRole.MANAGER,
        );

        const isAuthor = issue.authorId === userId;

        if (!hasManagerPermission && !isAuthor) {
            throw new ForbiddenException(
                '해당 이슈를 삭제할 권한이 없습니다. 매니저 이상의 권한이 필요하거나 작성자여야 합니다.',
            );
        }

        // 이슈 삭제
        await this.issueService.delete(issueId);

        // Activity Log 기록
        try {
            await this.activityLogService.logActivity(
                userId,
                issue.projectId,
                issueId,
                ActivityEntityType.ISSUE,
                'DELETED',
                `${user.name}님이 "${issue.title}" 이슈를 삭제했습니다.`,
                {
                    issueTitle: issue.title,
                    issueType: issue.type,
                },
            );
        } catch (error) {
            this.logger.error('Failed to log issue deletion activity', error);
        }

        this.logger.log(`Issue deleted successfully: ${issueId}`);
    }
}
