import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { UpdateIssueDto } from '../dtos/update-issue.dto';
import { IssueResponseDto } from '../dtos/issue-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateIssueUseCase {
    private readonly logger = new Logger(UpdateIssueUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(issueId: string, dto: UpdateIssueDto, userId: string): Promise<IssueResponseDto> {
        try {
            this.logger.log(`Updating issue ${issueId}: ${JSON.stringify(dto)}`);

            const issue = await this.issueService.findOne({ where: { id: issueId } });
            if (!issue) {
                throw new NotFoundException('이슈를 찾을 수 없습니다.');
            }

            // 권한 확인: 작성자이거나 프로젝트 관리자/소유자여야 함
            const hasAccess = await this.projectMemberService.hasPermission(issue.projectId, userId);
            if (!hasAccess) {
                throw new ForbiddenException('해당 프로젝트의 멤버만 이슈를 수정할 수 있습니다.');
            }

            // 작성자가 아닌 경우 관리자 권한이 필요
            if (issue.authorId !== userId) {
                const hasManagerAccess = await this.projectMemberService.hasPermission(
                    issue.projectId,
                    userId,
                    ProjectMemberRole.MANAGER,
                );
                if (!hasManagerAccess) {
                    throw new ForbiddenException('이슈 작성자이거나 프로젝트 관리자만 이슈를 수정할 수 있습니다.');
                }
            }

            // 이슈 업데이트
            await this.issueService.update(issueId, dto);

            // 업데이트된 이슈를 관계 데이터와 함께 조회
            const updatedIssue = await this.issueService.getIssueWithRelations(issueId);

            const issueResponseDto = plainToInstance(IssueResponseDto, updatedIssue, {
                excludeExtraneousValues: true,
            });

            this.logger.log(`Successfully updated issue: ${issueId}`);
            return issueResponseDto;
        } catch (error) {
            this.logger.error(`Failed to update issue: ${error.message}`, error.stack);
            throw error;
        }
    }
}
