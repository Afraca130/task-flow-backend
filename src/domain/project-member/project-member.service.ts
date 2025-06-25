import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { ProjectMember } from '../entities/project-member.entity';
import { DomainProjectMemberRepository } from './project-member.repository';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainProjectMemberService extends BaseService<ProjectMember> {
    constructor(private readonly projectMemberRepository: DomainProjectMemberRepository) {
        super(projectMemberRepository);
    }

    async countByProjectId(projectId: string, options?: IRepositoryOptions<ProjectMember>): Promise<number> {
        return this.projectMemberRepository.countByProjectId(projectId, options);
    }

    async addMember(
        projectId: string,
        userId: string,
        role: ProjectMemberRole = ProjectMemberRole.MEMBER,
        invitedBy?: string,
        options?: IRepositoryOptions<ProjectMember>,
    ): Promise<ProjectMember> {
        const memberData = {
            projectId,
            userId,
            role,
            invitedBy,
            joinedAt: new Date(),
            isActive: true,
        };

        const member = await this.create(memberData, options);
        return this.save(member, options);
    }

    async hasPermission(
        projectId: string,
        userId: string,
        requiredRole?: ProjectMemberRole,
        options?: IRepositoryOptions<ProjectMember>,
    ): Promise<boolean> {
        const member = await this.findOne({ where: { projectId, userId }, ...options });
        if (!member || !member.isActive) {
            return false;
        }

        if (!requiredRole) {
            return true;
        }

        // 권한 레벨: OWNER > MANAGER > MEMBER
        const roleHierarchy = {
            [ProjectMemberRole.OWNER]: 3,
            [ProjectMemberRole.MANAGER]: 2,
            [ProjectMemberRole.MEMBER]: 1,
        };

        return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
    }
}
