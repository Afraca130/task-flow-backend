import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class DeleteIssueUseCase {
    private readonly logger = new Logger(DeleteIssueUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(issueId: string, userId: string): Promise<void> {
        try {
            this.logger.log(`Deleting issue: ${issueId}`);

            const issue = await this.issueService.findOne({ where: { id: issueId } });
            if (!issue) {
                throw new NotFoundException('이슈를 찾을 수 없습니다.');
            }

            // 권한 확인: 작성자이거나 프로젝트 관리자/소유자여야 함
            const hasAccess = await this.projectMemberService.hasPermission(issue.projectId, userId);
            if (!hasAccess) {
                throw new ForbiddenException('해당 프로젝트의 멤버만 이슈를 삭제할 수 있습니다.');
            }

            // 작성자가 아닌 경우 관리자 권한이 필요
            if (issue.authorId !== userId) {
                const hasManagerAccess = await this.projectMemberService.hasPermission(
                    issue.projectId,
                    userId,
                    ProjectMemberRole.MANAGER,
                );
                if (!hasManagerAccess) {
                    throw new ForbiddenException('이슈 작성자이거나 프로젝트 관리자만 이슈를 삭제할 수 있습니다.');
                }
            }

            await this.issueService.delete(issueId);

            this.logger.log(`Successfully deleted issue: ${issueId}`);
        } catch (error) {
            this.logger.error(`Failed to delete issue: ${error.message}`, error.stack);
            throw error;
        }
    }
}
