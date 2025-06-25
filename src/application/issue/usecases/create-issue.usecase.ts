import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { CreateIssueDto } from '../dtos/create-issue.dto';
import { IssueResponseDto } from '../dtos/issue-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateIssueUseCase {
    private readonly logger = new Logger(CreateIssueUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(dto: CreateIssueDto, userId: string): Promise<IssueResponseDto> {
        try {
            this.logger.log(`Creating issue: ${JSON.stringify({ ...dto, authorId: userId })}`);

            // 프로젝트 멤버십 확인
            const hasAccess = await this.projectMemberService.hasPermission(dto.projectId, userId);
            if (!hasAccess) {
                throw new ForbiddenException('해당 프로젝트의 멤버만 이슈를 생성할 수 있습니다.');
            }

            const issue = await this.issueService.createIssue(dto.title, dto.projectId, userId, {
                description: dto.description,
                type: dto.type,
            });

            // 관계 데이터와 함께 조회
            const issueWithRelations = await this.issueService.getIssueWithRelations(issue.id);

            const issueResponseDto = plainToInstance(IssueResponseDto, issueWithRelations, {
                excludeExtraneousValues: true,
            });

            this.logger.log(`Successfully created issue: ${issue.id}`);
            return issueResponseDto;
        } catch (error) {
            this.logger.error(`Failed to create issue: ${error.message}`, error.stack);
            throw error;
        }
    }
}
