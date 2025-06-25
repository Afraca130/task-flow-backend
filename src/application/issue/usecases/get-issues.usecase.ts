import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { GetIssuesQueryDto } from '../dtos/get-issues-query.dto';
import { IssueResponseDto } from '../dtos/issue-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetIssuesUseCase {
    private readonly logger = new Logger(GetIssuesUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(
        query: GetIssuesQueryDto,
        userId: string,
    ): Promise<{
        data: IssueResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
            this.logger.log(`Getting issues with query: ${JSON.stringify(query)}`);

            // 프로젝트가 지정된 경우 멤버십 확인
            if (query.projectId) {
                const hasAccess = await this.projectMemberService.hasPermission(query.projectId, userId);
                if (!hasAccess) {
                    throw new NotFoundException('해당 프로젝트의 멤버만 이슈를 조회할 수 있습니다.');
                }
            }

            const result = await this.issueService.getIssuesWithFilters({
                projectId: query.projectId,
                type: query.type,
                authorId: query.authorId,
                search: query.search,
                page: query.page,
                limit: query.limit,
            });

            const issueResponseDtos = result.data.map((issue) =>
                plainToInstance(IssueResponseDto, issue, { excludeExtraneousValues: true }),
            );

            this.logger.log(`Successfully retrieved ${result.data.length} issues`);

            return {
                data: issueResponseDtos,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            };
        } catch (error) {
            this.logger.error(`Failed to get issues: ${error.message}`, error.stack);
            throw error;
        }
    }
}
