import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

@Injectable()
export class RemoveProjectMemberUseCase {
    private readonly logger = new Logger(RemoveProjectMemberUseCase.name);

    constructor(
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(projectId: string, memberId: string, currentUserId: string): Promise<void> {
        this.logger.log(`Removing member from project: ${projectId}, member: ${memberId} by user: ${currentUserId}`);

        // 현재 사용자 정보 조회
        const currentUser = await this.userService.findOne({
            where: { id: currentUserId },
        });

        if (!currentUser) {
            throw new NotFoundException('현재 사용자를 찾을 수 없습니다.');
        }

        // 권한 확인 (매니저 이상)
        const hasPermission = await this.projectMemberService.hasPermission(
            projectId,
            currentUserId,
            ProjectMemberRole.MANAGER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('멤버를 제거할 권한이 없습니다. 매니저 이상의 권한이 필요합니다.');
        }

        // 대상 멤버 정보 조회
        const targetMember = await this.projectMemberService.findOne({
            where: { projectId, userId: memberId },
            relations: ['user'],
        });

        if (!targetMember) {
            throw new NotFoundException('해당 프로젝트에서 멤버를 찾을 수 없습니다.');
        }

        // 자기 자신을 제거하려는 경우 방지
        if (currentUserId === memberId) {
            throw new ForbiddenException('자기 자신을 프로젝트에서 제거할 수 없습니다.');
        }

        // 멤버 제거
        await this.projectMemberService.delete(targetMember.id);

        // Activity Log 기록
        try {
            const description = `${currentUser.name}님이 ${targetMember.user.name}님을 프로젝트에서 제거했습니다.`;
            await this.activityLogService.logActivity(
                currentUserId,
                projectId,
                targetMember.id,
                ActivityEntityType.PROJECT_MEMBER,
                'REMOVED',
                description,
                {
                    targetUserId: memberId,
                    targetUserName: targetMember.user.name,
                    targetUserRole: targetMember.role,
                },
            );
        } catch (error) {
            this.logger.error('Failed to log member removal activity', error);
        }

        this.logger.log(`Member removed successfully: ${memberId}`);
    }
}
