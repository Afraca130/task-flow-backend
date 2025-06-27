import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/application/user/user.service';
import {
    GetUserProjectsUseCase,
    GetUsersUseCase,
    SearchUsersUseCase,
    UpdateUserUseCase,
} from '../../src/application/user/usecases';
import { SearchUsersQueryDto, UpdateUserDto, UserResponseDto } from '../../src/application/user/dtos';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PaginationData } from '../../src/common/dtos';
import { ProjectResponseDto } from '../../src/application/project/dtos';

describe('UserService', () => {
    let service: UserService;
    let getUserProjectsUseCase: GetUserProjectsUseCase;
    let getUsersUseCase: GetUsersUseCase;
    let searchUsersUseCase: SearchUsersUseCase;
    let updateUserUseCase: UpdateUserUseCase;

    const mockGetUserProjectsUseCase = {
        execute: jest.fn(),
    };

    const mockGetUsersUseCase = {
        execute: jest.fn(),
    };

    const mockSearchUsersUseCase = {
        execute: jest.fn(),
    };

    const mockUpdateUserUseCase = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: GetUserProjectsUseCase,
                    useValue: mockGetUserProjectsUseCase,
                },
                {
                    provide: GetUsersUseCase,
                    useValue: mockGetUsersUseCase,
                },
                {
                    provide: SearchUsersUseCase,
                    useValue: mockSearchUsersUseCase,
                },
                {
                    provide: UpdateUserUseCase,
                    useValue: mockUpdateUserUseCase,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        getUserProjectsUseCase = module.get<GetUserProjectsUseCase>(GetUserProjectsUseCase);
        getUsersUseCase = module.get<GetUsersUseCase>(GetUsersUseCase);
        searchUsersUseCase = module.get<SearchUsersUseCase>(SearchUsersUseCase);
        updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getUserProjects', () => {
        const userId = 'user-1';

        it('should return user projects', async () => {
            const expectedProjects = {
                data: [
                    {
                        id: 'project-1',
                        name: 'Project 1',
                        description: 'Description 1',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        updatedAt: '2024-01-01T00:00:00.000Z',
                    },
                    {
                        id: 'project-2',
                        name: 'Project 2',
                        description: 'Description 2',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        updatedAt: '2024-01-01T00:00:00.000Z',
                    },
                ],
                meta: {
                    total: 2,
                    page: 1,
                    limit: 2,
                    totalPages: 1,
                },
            } as PaginationData<ProjectResponseDto>;

            mockGetUserProjectsUseCase.execute.mockResolvedValue(expectedProjects);

            const result = await service.getUserProjects(userId);

            expect(result).toBeDefined();
            expect(result).toEqual(expectedProjects);
            expect(mockGetUserProjectsUseCase.execute).toHaveBeenCalledWith(userId);
        });
    });

    describe('getUsers', () => {
        it('should return all users', async () => {
            const expectedUsers = {
                data: [
                    {
                        id: 'user-1',
                        email: 'user1@example.com',
                        name: 'User 1',
                        profileColor: '#3B82F6',
                        isActive: true,
                        lastLoginAt: '2024-01-01T00:00:00.000Z',
                        lastProjectId: 'project-1',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        updatedAt: '2024-01-01T00:00:00.000Z',
                        password: 'hashedPassword1',
                    },
                    {
                        id: 'user-2',
                        email: 'user2@example.com',
                        name: 'User 2',
                        profileColor: '#2563EB',
                        isActive: true,
                        lastLoginAt: '2024-01-01T00:00:00.000Z',
                        lastProjectId: 'project-2',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        updatedAt: '2024-01-01T00:00:00.000Z',
                        password: 'hashedPassword2',
                    },
                ],
                meta: {
                    total: 2,
                    page: 1,
                    limit: 2,
                    totalPages: 1,
                },
            } as PaginationData<UserResponseDto>;

            mockGetUsersUseCase.execute.mockResolvedValue(expectedUsers);

            const result = await service.getUsers();

            expect(result).toBeDefined();
            expect(result).toEqual(expectedUsers);
            expect(mockGetUsersUseCase.execute).toHaveBeenCalled();
        });
    });

    describe('searchUsers', () => {
        const searchQuery = Object.assign(new SearchUsersQueryDto(), {
            search: 'test',
            isActive: true,
        });

        it('should return searched users', async () => {
            const expectedUsers = {
                data: [
                    {
                        id: 'user-1',
                        email: 'test@example.com',
                        name: 'Test User',
                        profileColor: '#3B82F6',
                        isActive: true,
                        lastLoginAt: '2024-01-01T00:00:00.000Z',
                        lastProjectId: 'project-1',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        updatedAt: '2024-01-01T00:00:00.000Z',
                        password: 'hashedPassword',
                    },
                ],
                meta: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                },
            } as PaginationData<UserResponseDto>;

            mockSearchUsersUseCase.execute.mockResolvedValue(expectedUsers);

            const result = await service.searchUsers(searchQuery);

            expect(result).toBeDefined();
            expect(result).toEqual(expectedUsers);
            expect(mockSearchUsersUseCase.execute).toHaveBeenCalledWith(searchQuery);
        });
    });

    describe('updateUser', () => {
        const userId = 'user-1';
        const requestUserId = 'user-1';
        const updateUserDto: UpdateUserDto = {
            name: 'Updated Name',
            profileColor: '#FF0000',
        };

        it('should update user if authorized', async () => {
            const updatedUser: UserResponseDto = {
                id: userId,
                email: 'user@example.com',
                name: updateUserDto.name ?? '',
                profileColor: updateUserDto.profileColor,
                isActive: true,
                lastLoginAt: '2024-01-01T00:00:00.000Z',
                lastProjectId: 'project-1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                password: 'hashedPassword',
            };

            mockUpdateUserUseCase.execute.mockResolvedValue(updatedUser);

            const result = await service.updateUser(userId, updateUserDto, requestUserId);

            expect(result).toBeDefined();
            expect(result).toEqual(updatedUser);
            expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(userId, updateUserDto, requestUserId);
        });

        it('should throw ForbiddenException if unauthorized', async () => {
            mockUpdateUserUseCase.execute.mockRejectedValue(new ForbiddenException());

            await expect(service.updateUser(userId, updateUserDto, 'other-user')).rejects.toThrow(ForbiddenException);
        });
    });
});
