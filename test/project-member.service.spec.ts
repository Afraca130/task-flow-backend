import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMemberService } from '../src/application/project-member/project-member.service';
import { GetProjectMembersUseCase } from '../src/application/project-member/usecases/get-project-members.usecase';
import { UpdateMemberRoleUseCase } from '../src/application/project-member/usecases/update-member-role.usecase';
import { RemoveProjectMemberUseCase } from '../src/application/project-member/usecases/remove-project-member.usecase';
import { ProjectMemberRole } from '../src/common/enums/project-member-role.enum';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProjectMemberResponseDto } from '../src/application/project-member/dtos/project-member-response.dto';

describe('ProjectMemberService', () => {
    let service: ProjectMemberService;
    let getProjectMembersUseCase: GetProjectMembersUseCase;
    let updateMemberRoleUseCase: UpdateMemberRoleUseCase;
    let removeProjectMemberUseCase: RemoveProjectMemberUseCase;

    const mockGetProjectMembersUseCase = {
        execute: jest.fn(),
    };

    const mockUpdateMemberRoleUseCase = {
        execute: jest.fn(),
    };

    const mockRemoveProjectMemberUseCase = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectMemberService,
                {
                    provide: GetProjectMembersUseCase,
                    useValue: mockGetProjectMembersUseCase,
                },
                {
                    provide: UpdateMemberRoleUseCase,
                    useValue: mockUpdateMemberRoleUseCase,
                },
                {
                    provide: RemoveProjectMemberUseCase,
                    useValue: mockRemoveProjectMemberUseCase,
                },
            ],
        }).compile();

        service = module.get<ProjectMemberService>(ProjectMemberService);
        getProjectMembersUseCase = module.get<GetProjectMembersUseCase>(GetProjectMembersUseCase);
        updateMemberRoleUseCase = module.get<UpdateMemberRoleUseCase>(UpdateMemberRoleUseCase);
        removeProjectMemberUseCase = module.get<RemoveProjectMemberUseCase>(RemoveProjectMemberUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProjectMembers', () => {
        const projectId = 'project-1';
        const userId = 'user-1';

        it('should return project members if user has permission', async () => {
            const mockMembers = [
                {
                    id: 'member-1',
                    projectId,
                    userId: 'user-2',
                    role: ProjectMemberRole.MEMBER,
                    joinedAt: new Date().toISOString(),
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ];
            mockGetProjectMembersUseCase.execute.mockResolvedValue(mockMembers);

            const result = await service.getProjectMembers(projectId, userId);

            expect(result).toBeDefined();
            expect(mockGetProjectMembersUseCase.execute).toHaveBeenCalledWith(projectId, userId);
        });

        it('should throw ForbiddenException if user has no permission', async () => {
            mockGetProjectMembersUseCase.execute.mockRejectedValue(new ForbiddenException());

            await expect(service.getProjectMembers(projectId, userId)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('updateMemberRole', () => {
        const projectId = 'project-1';
        const targetUserId = 'user-2';
        const requestUserId = 'user-1';
        const newRole = ProjectMemberRole.MANAGER;

        it('should update member role if user is owner', async () => {
            const updatedMember = {
                id: 'member-1',
                projectId,
                userId: targetUserId,
                role: newRole,
                joinedAt: new Date().toISOString(),
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            mockUpdateMemberRoleUseCase.execute.mockResolvedValue(updatedMember);

            const result = await service.updateMemberRole(projectId, targetUserId, newRole, requestUserId);

            expect(result).toBeDefined();
            expect(mockUpdateMemberRoleUseCase.execute).toHaveBeenCalledWith(
                projectId,
                targetUserId,
                { role: newRole },
                requestUserId,
            );
        });

        it('should throw NotFoundException if member not found', async () => {
            mockUpdateMemberRoleUseCase.execute.mockRejectedValue(new NotFoundException());

            await expect(service.updateMemberRole(projectId, targetUserId, newRole, requestUserId)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw ForbiddenException if user is not owner', async () => {
            mockUpdateMemberRoleUseCase.execute.mockRejectedValue(new ForbiddenException());

            await expect(service.updateMemberRole(projectId, targetUserId, newRole, requestUserId)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });

    describe('removeProjectMember', () => {
        const projectId = 'project-1';
        const targetUserId = 'user-2';
        const requestUserId = 'user-1';

        it('should remove member if user is owner', async () => {
            mockRemoveProjectMemberUseCase.execute.mockResolvedValue(undefined);

            await service.removeProjectMember(projectId, targetUserId, requestUserId);

            expect(mockRemoveProjectMemberUseCase.execute).toHaveBeenCalledWith(projectId, targetUserId, requestUserId);
        });

        it('should throw NotFoundException if member not found', async () => {
            mockRemoveProjectMemberUseCase.execute.mockRejectedValue(new NotFoundException());

            await expect(service.removeProjectMember(projectId, targetUserId, requestUserId)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw ForbiddenException if user is not owner', async () => {
            mockRemoveProjectMemberUseCase.execute.mockRejectedValue(new ForbiddenException());

            await expect(service.removeProjectMember(projectId, targetUserId, requestUserId)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });
});
