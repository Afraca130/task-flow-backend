import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';
import { plainToInstance } from 'class-transformer';
import { UpdateMemberRoleDto } from '../dtos/update-member-role.dto';
import { ProjectMemberResponseDto } from '../dtos/project-member-response.dto';

@Injectable()
export class UpdateMemberRoleUseCase {
    private readonly logger = new Logger(UpdateMemberRoleUseCase.name);

    constructor(
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly projectService: DomainProjectService,
        private readonly userService: DomainUserService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(
        projectId: string,
        memberId: string,
        updateMemberRoleDto: UpdateMemberRoleDto,
        currentUserId: string,
    ): Promise<ProjectMemberResponseDto> {
        this.logger.log(`Updating member role in project: ${projectId}, member: ${memberId} by user: ${currentUserId}`);

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
            throw new ForbiddenException('멤버 역할을 변경할 권한이 없습니다. 매니저 이상의 권한이 필요합니다.');
        }

        // 대상 멤버 정보 조회
        const targetMember = await this.projectMemberService.findOne({
            where: { projectId, userId: memberId },
            relations: ['user'],
        });

        if (!targetMember) {
            throw new NotFoundException('해당 프로젝트에서 멤버를 찾을 수 없습니다.');
        }

        const oldRole = targetMember.role;
        const newRole = updateMemberRoleDto.role;

        // 역할이 동일한 경우
        if (oldRole === newRole) {
            return plainToInstance(ProjectMemberResponseDto, targetMember, {
                excludeExtraneousValues: true,
            });
        }

        // 멤버 역할 업데이트
        const updatedMember = await this.projectMemberService.update(targetMember.id, {
            role: newRole,
        });

        // Activity Log 기록
        try {
            const description = `${currentUser.name}님이 ${targetMember.user.name}님의 역할을 ${oldRole}에서 ${newRole}로 변경했습니다.`;
            await this.activityLogService.logActivity(
                currentUserId,
                projectId,
                targetMember.id,
                ActivityEntityType.PROJECT_MEMBER,
                'ROLE_UPDATED',
                description,
                {
                    targetUserId: memberId,
                    targetUserName: targetMember.user.name,
                    oldRole: oldRole,
                    newRole: newRole,
                },
            );
        } catch (error) {
            this.logger.error('Failed to log member role update activity', error);
        }

        // 관계 정보와 함께 멤버 조회
        const memberWithRelations = await this.projectMemberService.findOne({
            where: { id: updatedMember.id },
            relations: ['user', 'project'],
        });

        this.logger.log(`Member role updated successfully: ${memberId}`);

        return plainToInstance(ProjectMemberResponseDto, memberWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
