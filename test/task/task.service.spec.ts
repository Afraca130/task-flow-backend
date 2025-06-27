import { Test, TestingModule } from '@nestjs/testing';
import { DomainTaskService } from '../../src/domain/task/task.service';
import { DomainTaskRepository } from '../../src/domain/task/task.repository';
import { Task } from '../../src/domain/entities/task.entity';
import { TaskStatus } from '../../src/common/enums/task-status.enum';
import { TaskPriority } from '../../src/common/enums/task-priority.enum';
import { IRepositoryOptions } from '../../src/common/interfaces/repository.interface';
import { NotFoundException } from '@nestjs/common';

interface MockTask extends Partial<Task> {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    assignerId: string;
    assigneeId?: string;
    dueDate?: Date;
    tags?: string[];
    lexoRank: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

describe('DomainTaskService', () => {
    let service: DomainTaskService;
    let taskRepository: DomainTaskRepository;

    const mockTaskRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByProjectId: jest.fn(),
        findByProjectAndStatus: jest.fn(),
        findWithFilters: jest.fn(),
        countByProjectId: jest.fn(),
        getNextLexoRank: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DomainTaskService,
                {
                    provide: DomainTaskRepository,
                    useValue: mockTaskRepository,
                },
            ],
        }).compile();

        service = module.get<DomainTaskService>(DomainTaskService);
        taskRepository = module.get<DomainTaskRepository>(DomainTaskRepository);

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getTasksByProject', () => {
        const projectId = 'project-1';
        const mockTasks: MockTask[] = [
            {
                id: 'task-1',
                title: 'Task 1',
                description: 'Description 1',
                status: TaskStatus.TODO,
                priority: TaskPriority.MEDIUM,
                projectId,
                assignerId: 'user-1',
                assigneeId: 'user-2',
                dueDate: new Date(),
                lexoRank: 'a',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            },
            {
                id: 'task-2',
                title: 'Task 2',
                description: 'Description 2',
                status: TaskStatus.IN_PROGRESS,
                priority: TaskPriority.HIGH,
                projectId,
                assignerId: 'user-1',
                assigneeId: 'user-3',
                dueDate: new Date(),
                lexoRank: 'b',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            },
        ];

        it('should return tasks for a project', async () => {
            mockTaskRepository.findByProjectId.mockResolvedValue(mockTasks);

            const result = await service.getTasksByProject(projectId);

            expect(result).toBeDefined();
            expect(result).toEqual(mockTasks);
            expect(mockTaskRepository.findByProjectId).toHaveBeenCalledWith(projectId, undefined);
        });
    });

    describe('updateTaskStatus', () => {
        const taskId = 'task-1';
        const newStatus = TaskStatus.IN_PROGRESS;
        const mockTask: MockTask = {
            id: taskId,
            title: 'Task 1',
            description: 'Description 1',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            projectId: 'project-1',
            assignerId: 'user-1',
            assigneeId: 'user-2',
            lexoRank: 'a',
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
        };

        it('should update task status', async () => {
            const updatedTask = { ...mockTask, status: newStatus };
            mockTaskRepository.update.mockResolvedValue(updatedTask);

            const result = await service.updateTaskStatus(taskId, newStatus);

            expect(result).toBeDefined();
            expect(result.status).toBe(newStatus);
            expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, { status: newStatus }, undefined);
        });

        it('should throw NotFoundException when task not found', async () => {
            mockTaskRepository.update.mockRejectedValue(
                new NotFoundException(`Task Entity with id ${taskId} not found`),
            );

            await expect(service.updateTaskStatus(taskId, newStatus)).rejects.toThrow(NotFoundException);
            expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, { status: newStatus }, undefined);
        });

        it('should pass repository options when provided', async () => {
            const updatedTask = { ...mockTask, status: newStatus };
            const options: IRepositoryOptions<Task> = {
                queryRunner: { manager: { getRepository: jest.fn() } } as any,
            };
            mockTaskRepository.update.mockResolvedValue(updatedTask);

            const result = await service.updateTaskStatus(taskId, newStatus, options);

            expect(result).toBeDefined();
            expect(result.status).toBe(newStatus);
            expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, { status: newStatus }, options);
        });
    });

    describe('assignTask', () => {
        const taskId = 'task-1';
        const assigneeId = 'user-2';
        const mockTask: MockTask = {
            id: taskId,
            title: 'Task 1',
            description: 'Description 1',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            projectId: 'project-1',
            assignerId: 'user-1',
            assigneeId: undefined,
            lexoRank: 'a',
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
        };

        it('should assign task to user', async () => {
            const updatedTask = { ...mockTask, assigneeId };
            mockTaskRepository.update.mockResolvedValue(updatedTask);

            const result = await service.assignTask(taskId, assigneeId);

            expect(result).toBeDefined();
            expect(result.assigneeId).toBe(assigneeId);
            expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, { assigneeId }, undefined);
        });

        it('should throw NotFoundException when task not found', async () => {
            mockTaskRepository.update.mockRejectedValue(
                new NotFoundException(`Task Entity with id ${taskId} not found`),
            );

            await expect(service.assignTask(taskId, assigneeId)).rejects.toThrow(NotFoundException);
            expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, { assigneeId }, undefined);
        });

        it('should pass repository options when provided', async () => {
            const updatedTask = { ...mockTask, assigneeId };
            const options: IRepositoryOptions<Task> = {
                queryRunner: { manager: { getRepository: jest.fn() } } as any,
            };
            mockTaskRepository.update.mockResolvedValue(updatedTask);

            const result = await service.assignTask(taskId, assigneeId, options);

            expect(result).toBeDefined();
            expect(result.assigneeId).toBe(assigneeId);
            expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, { assigneeId }, options);
        });
    });

    describe('getTaskWithRelations', () => {
        const taskId = 'task-1';
        const mockTask: MockTask = {
            id: taskId,
            title: 'Task 1',
            description: 'Description 1',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            projectId: 'project-1',
            assignerId: 'user-1',
            assigneeId: 'user-2',
            lexoRank: 'a',
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
        };

        it('should return task with relations', async () => {
            mockTaskRepository.findOne.mockResolvedValue(mockTask);

            const result = await service.getTaskWithRelations(taskId);

            expect(result).toBeDefined();
            expect(result).toEqual(mockTask);
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { id: taskId },
                relations: ['assignee', 'assigner', 'project'],
            });
        });

        it('should return null if task not found', async () => {
            mockTaskRepository.findOne.mockResolvedValue(null);

            const result = await service.getTaskWithRelations(taskId);

            expect(result).toBeNull();
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { id: taskId },
                relations: ['assignee', 'assigner', 'project'],
            });
        });

        it('should pass repository options when provided', async () => {
            const options: IRepositoryOptions<Task> = {
                queryRunner: { manager: { getRepository: jest.fn() } } as any,
            };
            mockTaskRepository.findOne.mockResolvedValue(mockTask);

            const result = await service.getTaskWithRelations(taskId, options);

            expect(result).toBeDefined();
            expect(result).toEqual(mockTask);
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { id: taskId },
                relations: ['assignee', 'assigner', 'project'],
                ...options,
            });
        });
    });

    describe('countTasksByProject', () => {
        const projectId = 'project-1';

        it('should return task count for project', async () => {
            const expectedCount = 5;
            mockTaskRepository.countByProjectId.mockResolvedValue(expectedCount);

            const result = await service.countTasksByProject(projectId);

            expect(result).toBe(expectedCount);
            expect(mockTaskRepository.countByProjectId).toHaveBeenCalledWith(projectId, undefined);
        });
    });
});
