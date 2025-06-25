import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainNotificationService } from '@src/domain/notification/notification.service';
import { CreateIssueWithMentionsDto } from '../dtos/create-issue-with-mentions.dto';
import { IssueResponseDto } from '../dtos/issue-response.dto';
import { NotificationType } from '@src/common/enums/notification-type.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateIssueWithMentionsUseCase {
    private readonly logger = new Logger(CreateIssueWithMentionsUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly notificationService: DomainNotificationService,
    ) {}

    async execute(dto: CreateIssueWithMentionsDto, userId: string): Promise<IssueResponseDto> {
        try {
            this.logger.log(`Creating issue with mentions: ${JSON.stringify({ ...dto, authorId: userId })}`);

            // 프로젝트 멤버십 확인
            const hasAccess = await this.projectMemberService.hasPermission(dto.issue.projectId, userId);
            if (!hasAccess) {
                throw new ForbiddenException('해당 프로젝트의 멤버만 이슈를 생성할 수 있습니다.');
            }

            // 이슈 생성
            const issue = await this.issueService.createIssue(dto.issue.title, dto.issue.projectId, userId, {
                description: dto.issue.description,
                type: dto.issue.type,
            });

            // 멘션된 사용자들에게 알림 생성
            if (dto.mentionedUserIds && dto.mentionedUserIds.length > 0) {
                const notificationPromises = dto.mentionedUserIds.map(async (mentionedUserId) => {
                    // 자신을 멘션한 경우는 제외
                    if (mentionedUserId === userId) return;

                    // 멘션된 사용자가 프로젝트 멤버인지 확인
                    const isMember = await this.projectMemberService.hasPermission(
                        dto.issue.projectId,
                        mentionedUserId,
                    );
                    if (!isMember) return;

                    return this.notificationService.create({
                        userId: mentionedUserId,
                        title: '새 이슈에서 멘션되었습니다',
                        message: `${issue.title}에서 멘션되었습니다.`,
                        type: NotificationType.ISSUE_MENTION,
                        data: {
                            referenceId: issue.id,
                            referenceType: 'issue',
                            projectId: dto.issue.projectId,
                        },
                    });
                });

                await Promise.all(notificationPromises);
                this.logger.log(`Created notifications for ${dto.mentionedUserIds.length} mentioned users`);
            }

            // 관계 데이터와 함께 조회
            const issueWithRelations = await this.issueService.getIssueWithRelations(issue.id);

            const issueResponseDto = plainToInstance(IssueResponseDto, issueWithRelations, {
                excludeExtraneousValues: true,
            });

            this.logger.log(`Successfully created issue with mentions: ${issue.id}`);
            return issueResponseDto;
        } catch (error) {
            this.logger.error(`Failed to create issue with mentions: ${error.message}`, error.stack);
            throw error;
        }
    }
}
