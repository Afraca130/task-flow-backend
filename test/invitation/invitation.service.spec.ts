import { Test, TestingModule } from '@nestjs/testing';
import { DomainInvitationService } from '../../src/domain/invitation/invitation.service';
import { DomainInvitationRepository } from '../../src/domain/invitation/invitation.repository';
import { ProjectInvitation } from '../../src/domain/entities/project-invitation.entity';
import { DeepPartial } from 'typeorm';
import { IRepositoryOptions } from '../../src/common/interfaces/repository.interface';
import { InvitationStatus } from '../../src/common/enums/invitation-status.enum';
import { IService } from '../../src/common/interfaces/service.interface';
import { IRepository } from '../../src/common/interfaces/repository.interface';
import { Project } from '../../src/domain/entities/project.entity';
import { User } from '../../src/domain/entities/user.entity';
import { ProjectPriority } from '../../src/common/enums/project-priority.enum';

interface MockProject extends Omit<Project, 'description' | 'dueDate' | 'owner' | 'members' | 'tasks'> {
    id: string;
    name: string;
    description?: string;
    color: string;
    priority: ProjectPriority;
    dueDate?: Date;
    isActive: boolean;
    ownerId: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface MockUser extends Omit<User, 'projects' | 'comments'> {
    id: string;
    email: string;
    password: string;
    name: string;
    profileColor: string;
    isActive: boolean;
    lastLoginAt: Date;
    lastProjectId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface MockProjectInvitation extends Omit<ProjectInvitation, 'project' | 'inviter' | 'invitee'> {
    id: string;
    projectId: string;
    inviterId: string;
    inviteeId?: string;
    status: InvitationStatus;
    token: string;
    message?: string;
    expiresAt: Date;
    respondedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    project: MockProject;
    inviter: MockUser;
    invitee?: MockUser;
}

describe('DomainInvitationService', () => {
    let service: DomainInvitationService & IService<ProjectInvitation>;
    let invitationRepository: DomainInvitationRepository;

    const mockProject: MockProject = {
        id: 'project-1',
        name: 'Test Project',
        color: '#3B82F6',
        priority: ProjectPriority.MEDIUM,
        isActive: true,
        ownerId: 'user-1',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockUser: MockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        profileColor: '#000000',
        isActive: true,
        lastLoginAt: new Date(),
        lastProjectId: 'project-1',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockInvitationRepository: jest.Mocked<IRepository<ProjectInvitation>> & {
        markExpiredInvitations: jest.Mock;
    } = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        markExpiredInvitations: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DomainInvitationService,
                {
                    provide: DomainInvitationRepository,
                    useValue: mockInvitationRepository,
                },
            ],
        }).compile();

        service = module.get<DomainInvitationService & IService<ProjectInvitation>>(DomainInvitationService);
        invitationRepository = module.get<DomainInvitationRepository>(DomainInvitationRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('markExpiredInvitations', () => {
        it('should mark expired invitations', async () => {
            const options: IRepositoryOptions<ProjectInvitation> = { where: { status: InvitationStatus.PENDING } };
            mockInvitationRepository.markExpiredInvitations.mockResolvedValue(undefined);

            await service.markExpiredInvitations(options);

            expect(mockInvitationRepository.markExpiredInvitations).toHaveBeenCalledWith(options);
        });
    });

    describe('findOne', () => {
        const invitationId = 'invitation-1';
        const mockInvitation: MockProjectInvitation = {
            id: invitationId,
            projectId: mockProject.id,
            inviterId: mockUser.id,
            status: InvitationStatus.PENDING,
            token: 'token123',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
            createdAt: new Date(),
            updatedAt: new Date(),
            project: mockProject,
            inviter: mockUser,
        };

        it('should find invitation by id', async () => {
            mockInvitationRepository.findOne.mockResolvedValue(mockInvitation as unknown as ProjectInvitation);

            const result = await service.findOne({
                where: { id: invitationId },
            } as IRepositoryOptions<ProjectInvitation>);

            expect(result).toBeDefined();
            expect(result).toEqual(mockInvitation);
            expect(mockInvitationRepository.findOne).toHaveBeenCalledWith({ where: { id: invitationId } });
        });

        it('should return null if invitation not found', async () => {
            mockInvitationRepository.findOne.mockResolvedValue(null);

            const result = await service.findOne({
                where: { id: invitationId },
            } as IRepositoryOptions<ProjectInvitation>);

            expect(result).toBeNull();
        });
    });

    describe('create and save', () => {
        const mockInvitation: DeepPartial<ProjectInvitation> = {
            projectId: mockProject.id,
            inviterId: mockUser.id,
            status: InvitationStatus.PENDING,
            token: 'token123',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            project: mockProject as unknown as Project,
            inviter: mockUser as unknown as User,
        };

        it('should create and save invitation', async () => {
            const createdInvitation = { id: 'invitation-1', ...mockInvitation } as unknown as ProjectInvitation;
            mockInvitationRepository.create.mockReturnValue(Promise.resolve(createdInvitation));
            mockInvitationRepository.save.mockResolvedValue(createdInvitation);

            const result = await service.create(mockInvitation);
            expect(result).toBeDefined();
            expect(mockInvitationRepository.create).toHaveBeenCalledWith(mockInvitation, undefined);

            const savedResult = await service.save(mockInvitation);
            expect(savedResult).toBeDefined();
            expect(savedResult).toEqual(createdInvitation);
            expect(mockInvitationRepository.save).toHaveBeenCalledWith(mockInvitation, undefined);
        });
    });

    describe('findAll', () => {
        const projectId = mockProject.id;
        const mockInvitations: MockProjectInvitation[] = [
            {
                id: 'invitation-1',
                projectId,
                inviterId: mockUser.id,
                status: InvitationStatus.PENDING,
                token: 'token123',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                createdAt: new Date(),
                updatedAt: new Date(),
                project: mockProject,
                inviter: mockUser,
            },
            {
                id: 'invitation-2',
                projectId,
                inviterId: mockUser.id,
                status: InvitationStatus.PENDING,
                token: 'token456',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                createdAt: new Date(),
                updatedAt: new Date(),
                project: mockProject,
                inviter: mockUser,
            },
        ];

        it('should find all invitations by project id', async () => {
            mockInvitationRepository.findAll.mockResolvedValue(mockInvitations as unknown as ProjectInvitation[]);

            const result = await service.findAll({ where: { projectId } } as IRepositoryOptions<ProjectInvitation>);

            expect(result).toBeDefined();
            expect(result).toEqual(mockInvitations);
            expect(mockInvitationRepository.findAll).toHaveBeenCalledWith({ where: { projectId } });
        });
    });
});
