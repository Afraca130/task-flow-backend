import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { UpdateIssueDto } from '../dtos/update-issue.dto';
import { IssueResponseDto } from '../dtos/issue-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateIssueUseCase {
    private readonly logger = new Logger(UpdateIssueUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(issueId: string, updateIssueDto: UpdateIssueDto, userId: string): Promise<IssueResponseDto> {
        this.logger.log(`Updating issue: ${issueId} by user: ${userId}`);

        // 이슈 존재 확인
        const existingIssue = await this.issueService.findOne({
            where: { id: issueId },
        });

        if (!existingIssue) {
            throw new NotFoundException('이슈를 찾을 수 없습니다.');
        }

        // 사용자 정보 조회
        const user = await this.userService.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 권한 확인 (프로젝트 멤버이거나 이슈 작성자)
        const hasPermission = await this.projectMemberService.hasPermission(
            existingIssue.projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        const isAuthor = existingIssue.authorId === userId;

        if (!hasPermission && !isAuthor) {
            throw new ForbiddenException('해당 이슈를 수정할 권한이 없습니다.');
        }

        // 변경사항 추적
        const changes: string[] = [];
        const metadata: Record<string, any> = {};

        if (updateIssueDto.title && updateIssueDto.title !== existingIssue.title) {
            changes.push(`제목: "${existingIssue.title}" → "${updateIssueDto.title}"`);
            metadata.oldTitle = existingIssue.title;
            metadata.newTitle = updateIssueDto.title;
        }

        if (updateIssueDto.description !== undefined && updateIssueDto.description !== existingIssue.description) {
            changes.push('설명 변경');
            metadata.oldDescription = existingIssue.description;
            metadata.newDescription = updateIssueDto.description;
        }

        if (updateIssueDto.type && updateIssueDto.type !== existingIssue.type) {
            changes.push(`타입: ${existingIssue.type} → ${updateIssueDto.type}`);
            metadata.oldType = existingIssue.type;
            metadata.newType = updateIssueDto.type;
        }

        // 이슈 업데이트
        const updatedIssue = await this.issueService.update(issueId, updateIssueDto);

        // Activity Log 기록 (변경사항이 있는 경우만)
        if (changes.length > 0) {
            try {
                const description = `${user.name}님이 "${existingIssue.title}" 이슈를 수정했습니다: ${changes.join(', ')}`;
                await this.activityLogService.logActivity(
                    userId,
                    existingIssue.projectId,
                    issueId,
                    ActivityEntityType.ISSUE,
                    'UPDATED',
                    description,
                    metadata,
                );
            } catch (error) {
                this.logger.error('Failed to log issue update activity', error);
            }
        }

        // 관계 정보와 함께 이슈 조회
        const issueWithRelations = await this.issueService.findOne({
            where: { id: updatedIssue.id },
            relations: ['project', 'author'],
        });

        this.logger.log(`Issue updated successfully: ${issueId}`);

        return plainToInstance(IssueResponseDto, issueWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
