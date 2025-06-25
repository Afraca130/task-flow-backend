import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { IssueResponseDto } from '../dtos/issue-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetIssueUseCase {
    private readonly logger = new Logger(GetIssueUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(issueId: string, userId: string): Promise<IssueResponseDto> {
        try {
            this.logger.log(`Getting issue with ID: ${issueId}`);

            const issue = await this.issueService.getIssueWithRelations(issueId);
            if (!issue) {
                throw new NotFoundException('이슈를 찾을 수 없습니다.');
            }

            // 프로젝트 멤버십 확인
            const hasAccess = await this.projectMemberService.hasPermission(issue.projectId, userId);
            if (!hasAccess) {
                throw new ForbiddenException('해당 프로젝트의 멤버만 이슈를 조회할 수 있습니다.');
            }

            const issueResponseDto = plainToInstance(IssueResponseDto, issue, {
                excludeExtraneousValues: true,
            });

            this.logger.log(`Successfully retrieved issue: ${issueId}`);
            return issueResponseDto;
        } catch (error) {
            this.logger.error(`Failed to get issue: ${error.message}`, error.stack);
            throw error;
        }
    }
}
