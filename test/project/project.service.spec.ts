import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../../src/application/project/project.service';
import {
    CreateProjectUseCase,
    DeleteProjectUseCase,
    GetProjectByIdUseCase,
    GetProjectsUseCase,
    UpdateProjectUseCase,
} from '../../src/application/project/usecases';
import { CreateProjectDto, UpdateProjectDto } from '../../src/application/project/dtos';
import { ProjectPriority } from '../../src/common/enums/project-priority.enum';

describe('ProjectService', () => {
    let service: ProjectService;
    let getProjectByIdUseCase: GetProjectByIdUseCase;
    let getProjectsUseCase: GetProjectsUseCase;
    let createProjectUseCase: CreateProjectUseCase;
    let updateProjectUseCase: UpdateProjectUseCase;
    let deleteProjectUseCase: DeleteProjectUseCase;

    const mockGetProjectByIdUseCase = {
        execute: jest.fn(),
    };

    const mockGetProjectsUseCase = {
        execute: jest.fn(),
    };

    const mockCreateProjectUseCase = {
        execute: jest.fn(),
    };

    const mockUpdateProjectUseCase = {
        execute: jest.fn(),
    };

    const mockDeleteProjectUseCase = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectService,
                {
                    provide: GetProjectByIdUseCase,
                    useValue: mockGetProjectByIdUseCase,
                },
                {
                    provide: GetProjectsUseCase,
                    useValue: mockGetProjectsUseCase,
                },
                {
                    provide: CreateProjectUseCase,
                    useValue: mockCreateProjectUseCase,
                },
                {
                    provide: UpdateProjectUseCase,
                    useValue: mockUpdateProjectUseCase,
                },
                {
                    provide: DeleteProjectUseCase,
                    useValue: mockDeleteProjectUseCase,
                },
            ],
        }).compile();

        service = module.get<ProjectService>(ProjectService);
        getProjectByIdUseCase = module.get<GetProjectByIdUseCase>(GetProjectByIdUseCase);
        getProjectsUseCase = module.get<GetProjectsUseCase>(GetProjectsUseCase);
        createProjectUseCase = module.get<CreateProjectUseCase>(CreateProjectUseCase);
        updateProjectUseCase = module.get<UpdateProjectUseCase>(UpdateProjectUseCase);
        deleteProjectUseCase = module.get<DeleteProjectUseCase>(DeleteProjectUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createProject', () => {
        const userId = 'user-1';
        const createProjectDto: CreateProjectDto = {
            name: 'Test Project',
            description: 'Test Description',
            priority: ProjectPriority.MEDIUM,
            color: '#FF0000',
            dueDate: new Date().toISOString(),
        };

        it('should create a project and add creator as owner', async () => {
            const createdProject = { id: 'project-1', ...createProjectDto };
            mockCreateProjectUseCase.execute.mockResolvedValue(createdProject);

            const result = await service.createProject(createProjectDto, userId);

            expect(result).toBeDefined();
            expect(mockCreateProjectUseCase.execute).toHaveBeenCalledWith(createProjectDto, userId);
        });
    });

    describe('updateProject', () => {
        const projectId = 'project-1';
        const userId = 'user-1';
        const updateProjectDto: UpdateProjectDto = {
            name: 'Updated Project',
            description: 'Updated Description',
        };

        it('should update project if user has permission', async () => {
            const updatedProject = { id: projectId, ...updateProjectDto };
            mockUpdateProjectUseCase.execute.mockResolvedValue(updatedProject);

            const result = await service.updateProject(projectId, updateProjectDto, userId);

            expect(result).toBeDefined();
            expect(mockUpdateProjectUseCase.execute).toHaveBeenCalledWith(projectId, updateProjectDto, userId);
        });
    });

    describe('deleteProject', () => {
        const projectId = 'project-1';
        const userId = 'user-1';

        it('should delete project if user is owner', async () => {
            const deleteResult = { affected: 1 };
            mockDeleteProjectUseCase.execute.mockResolvedValue(deleteResult);

            const result = await service.deleteProject(projectId, userId);

            expect(result).toBeDefined();
            expect(mockDeleteProjectUseCase.execute).toHaveBeenCalledWith(projectId, userId);
        });
    });
});
