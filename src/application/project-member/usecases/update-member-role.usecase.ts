import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class UpdateMemberRoleUseCase {
    private readonly logger = new Logger(UpdateMemberRoleUseCase.name);

    constructor(
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly projectService: DomainProjectService,
    ) {}

    async execute(
        projectId: string,
        targetUserId: string,
        newRole: ProjectMemberRole,
        requestUserId: string,
    ): Promise<void> {
        this.logger.log(`Updating role for user: ${targetUserId} in project: ${projectId} to ${newRole}`);

        // 프로젝트 존재 여부 확인
        const project = await this.projectService.findOne({
            where: { id: projectId },
        });
        console.log(project);
        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 요청자 권한 확인 (OWNER 또는 MANAGER만 역할 변경 가능)
        const requestUserPermission = await this.projectMemberService.hasPermission(
            projectId,
            requestUserId,
            ProjectMemberRole.MANAGER,
        );

        if (!requestUserPermission) {
            throw new ForbiddenException('멤버 역할을 변경할 권한이 없습니다.');
        }

        // 대상 멤버 존재 여부 확인 - BaseService의 findOne 사용
        const targetMember = await this.projectMemberService.findOne({
            where: { projectId, userId: targetUserId, isActive: true },
        });

        if (!targetMember) {
            throw new NotFoundException('해당 멤버를 찾을 수 없습니다.');
        }

        // 자기 자신의 OWNER 권한을 변경하려는 경우 방지
        if (requestUserId === targetUserId && targetMember.role === ProjectMemberRole.OWNER) {
            throw new BadRequestException('프로젝트 소유자는 자신의 권한을 변경할 수 없습니다.');
        }

        // 요청자가 MANAGER인 경우, OWNER로 변경하거나 OWNER의 권한을 변경할 수 없음
        const requestMember = await this.projectMemberService.findOne({
            where: { projectId, userId: requestUserId, isActive: true },
        });

        if (requestMember?.role === ProjectMemberRole.MANAGER) {
            if (newRole === ProjectMemberRole.OWNER) {
                throw new ForbiddenException('매니저는 소유자 권한을 부여할 수 없습니다.');
            }
            if (targetMember.role === ProjectMemberRole.OWNER) {
                throw new ForbiddenException('매니저는 소유자의 권한을 변경할 수 없습니다.');
            }
        }

        // 역할 업데이트 - BaseService의 update 사용
        await this.projectMemberService.update(targetMember.id, { role: newRole });

        this.logger.log(`Role updated successfully for user: ${targetUserId} to ${newRole}`);
    }
}
