import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class RemoveProjectMemberUseCase {
    private readonly logger = new Logger(RemoveProjectMemberUseCase.name);

    constructor(
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly projectService: DomainProjectService,
    ) {}

    async execute(projectId: string, targetUserId: string, requestUserId: string): Promise<void> {
        this.logger.log(`Removing user: ${targetUserId} from project: ${projectId}`);

        // 프로젝트 존재 여부 확인
        const project = await this.projectService.findOne({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 대상 멤버 존재 여부 확인 - BaseService의 findOne 사용
        const targetMember = await this.projectMemberService.findOne({
            where: { projectId, userId: targetUserId, isActive: true },
        });

        if (!targetMember) {
            throw new NotFoundException('해당 멤버를 찾을 수 없습니다.');
        }

        // 요청자 권한 확인 - BaseService의 findOne 사용
        const requestMember = await this.projectMemberService.findOne({
            where: { projectId, userId: requestUserId, isActive: true },
        });

        if (!requestMember) {
            throw new ForbiddenException('프로젝트 멤버가 아닙니다.');
        }

        // 권한 검증
        const canRemove = this.canRemoveMember(requestMember.role, targetMember.role, requestUserId === targetUserId);

        if (!canRemove.allowed) {
            throw new ForbiddenException(canRemove.message);
        }

        // 프로젝트 소유자는 제거할 수 없음 (탈퇴는 별도 기능으로)
        if (targetMember.role === ProjectMemberRole.OWNER) {
            throw new BadRequestException('프로젝트 소유자는 제거할 수 없습니다.');
        }

        // 멤버 제거 (soft delete) - BaseService의 update 사용
        await this.projectMemberService.update(targetMember.id, { isActive: false });

        this.logger.log(`Member removed successfully: ${targetUserId} from project: ${projectId}`);
    }

    private canRemoveMember(
        requestRole: ProjectMemberRole,
        targetRole: ProjectMemberRole,
        isSelfRemoval: boolean,
    ): { allowed: boolean; message?: string } {
        // 자기 자신을 제거하는 경우 (탈퇴)
        if (isSelfRemoval) {
            if (targetRole === ProjectMemberRole.OWNER) {
                return { allowed: false, message: '프로젝트 소유자는 스스로 탈퇴할 수 없습니다.' };
            }
            return { allowed: true };
        }

        // 다른 멤버를 제거하는 경우
        switch (requestRole) {
            case ProjectMemberRole.OWNER:
                return { allowed: true };

            case ProjectMemberRole.MANAGER:
                if (targetRole === ProjectMemberRole.MEMBER) {
                    return { allowed: true };
                }
                return { allowed: false, message: '매니저는 소유자나 다른 매니저를 제거할 수 없습니다.' };

            case ProjectMemberRole.MEMBER:
                return { allowed: false, message: '일반 멤버는 다른 멤버를 제거할 권한이 없습니다.' };

            default:
                return { allowed: false, message: '알 수 없는 권한입니다.' };
        }
    }
}
