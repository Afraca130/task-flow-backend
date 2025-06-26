import { Injectable } from '@nestjs/common';
import { GetProjectMembersUseCase } from './usecases/get-project-members.usecase';
import { UpdateMemberRoleUseCase } from './usecases/update-member-role.usecase';
import { RemoveProjectMemberUseCase } from './usecases/remove-project-member.usecase';
import { ProjectMemberResponseDto } from './dtos/project-member-response.dto';
import { UpdateMemberRoleDto } from './dtos/update-member-role.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class ProjectMemberService {
    constructor(
        private readonly getProjectMembersUseCase: GetProjectMembersUseCase,
        private readonly updateMemberRoleUseCase: UpdateMemberRoleUseCase,
        private readonly removeProjectMemberUseCase: RemoveProjectMemberUseCase,
    ) {}

    async getProjectMembers(projectId: string, userId: string): Promise<ProjectMemberResponseDto[]> {
        return this.getProjectMembersUseCase.execute(projectId, userId);
    }

    async updateMemberRole(
        projectId: string,
        targetUserId: string,
        newRole: ProjectMemberRole,
        requestUserId: string,
    ): Promise<ProjectMemberResponseDto> {
        const updateDto: UpdateMemberRoleDto = { role: newRole };
        return this.updateMemberRoleUseCase.execute(projectId, targetUserId, updateDto, requestUserId);
    }

    async removeProjectMember(projectId: string, targetUserId: string, requestUserId: string): Promise<void> {
        return this.removeProjectMemberUseCase.execute(projectId, targetUserId, requestUserId);
    }
}
