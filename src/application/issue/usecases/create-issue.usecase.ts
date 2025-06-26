import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { CreateIssueDto } from '../dtos/create-issue.dto';
import { IssueResponseDto } from '../dtos/issue-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateIssueUseCase {
    private readonly logger = new Logger(CreateIssueUseCase.name);

    constructor(
        private readonly issueService: DomainIssueService,
        private readonly projectService: DomainProjectService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(createIssueDto: CreateIssueDto, userId: string): Promise<IssueResponseDto> {
        const { title, description, type, projectId } = createIssueDto;

        this.logger.log(`Creating issue "${title}" in project: ${projectId} by user: ${userId}`);

        // 프로젝트 존재 확인
        const project = await this.projectService.findOne({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 작성자 정보 조회
        const creator = await this.userService.findOne({
            where: { id: userId },
        });

        if (!creator) {
            throw new NotFoundException('작성자를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인
        const hasPermission = await this.projectMemberService.hasPermission(
            projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('해당 프로젝트에서 이슈를 생성할 권한이 없습니다.');
        }

        const issueData = {
            title,
            description,
            type,
            projectId,
            authorId: userId,
        };

        const issue = await this.issueService.save(issueData);

        // Activity Log 기록
        try {
            await this.activityLogService.logActivity(
                userId,
                projectId,
                issue.id,
                ActivityEntityType.ISSUE,
                'CREATED',
                `${creator.name}님이 "${title}" 이슈를 생성했습니다.`,
                {
                    issueTitle: title,
                    issueType: type,
                },
            );
        } catch (error) {
            this.logger.error('Failed to log issue creation activity', error);
        }

        // 관계 정보와 함께 이슈 조회
        const issueWithRelations = await this.issueService.findOne({
            where: { id: issue.id },
            relations: ['project', 'author'],
        });

        this.logger.log(`Issue created successfully: ${issue.id}`);

        return plainToInstance(IssueResponseDto, issueWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
