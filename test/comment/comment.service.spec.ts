import { Test, TestingModule } from '@nestjs/testing';
import { DomainCommentService } from '../../src/domain/comment/comment.service';
import { DomainCommentRepository } from '../../src/domain/comment/comment.repository';
import { Comment } from '../../src/domain/entities/comment.entity';

interface MockComment extends Partial<Comment> {
    id: string;
    content: string;
    taskId: string;
    userId: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

describe('DomainCommentService', () => {
    let service: DomainCommentService;
    let commentRepository: DomainCommentRepository;

    const mockCommentRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        findByTaskIdFlat: jest.fn(),
        findByTaskIdWithReplies: jest.fn(),
        findByIdWithRelations: jest.fn(),
        countByTaskId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DomainCommentService,
                {
                    provide: DomainCommentRepository,
                    useValue: mockCommentRepository,
                },
            ],
        }).compile();

        service = module.get<DomainCommentService>(DomainCommentService);
        commentRepository = module.get<DomainCommentRepository>(DomainCommentRepository);

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getCommentsByTaskId', () => {
        const taskId = 'task-1';
        const mockComments: MockComment[] = [
            {
                id: 'comment-1',
                content: 'Comment 1',
                taskId,
                userId: 'user-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            },
            {
                id: 'comment-2',
                content: 'Comment 2',
                taskId,
                userId: 'user-2',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            },
        ];

        it('should return comments for a task', async () => {
            mockCommentRepository.findByTaskIdFlat.mockResolvedValue(mockComments);

            const result = await service.getCommentsByTaskId(taskId);

            expect(result).toBeDefined();
            expect(result).toEqual(mockComments);
            expect(mockCommentRepository.findByTaskIdFlat).toHaveBeenCalledWith(taskId, undefined);
        });
    });

    describe('getCommentsByTaskIdWithReplies', () => {
        const taskId = 'task-1';
        const mockComments: MockComment[] = [
            {
                id: 'comment-1',
                content: 'Parent Comment',
                taskId,
                userId: 'user-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            },
            {
                id: 'comment-2',
                content: 'Reply Comment',
                taskId,
                userId: 'user-2',
                parentId: 'comment-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
            },
        ];

        it('should return comments with replies for a task', async () => {
            mockCommentRepository.findByTaskIdWithReplies.mockResolvedValue(mockComments);

            const result = await service.getCommentsByTaskIdWithReplies(taskId);

            expect(result).toBeDefined();
            expect(result).toEqual(mockComments);
            expect(mockCommentRepository.findByTaskIdWithReplies).toHaveBeenCalledWith(taskId, undefined);
        });
    });

    describe('getCommentWithRelations', () => {
        const commentId = 'comment-1';
        const mockComment: MockComment = {
            id: commentId,
            content: 'Test Comment',
            taskId: 'task-1',
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
        };

        it('should return comment with relations', async () => {
            mockCommentRepository.findByIdWithRelations.mockResolvedValue(mockComment);

            const result = await service.getCommentWithRelations(commentId);

            expect(result).toBeDefined();
            expect(result).toEqual(mockComment);
            expect(mockCommentRepository.findByIdWithRelations).toHaveBeenCalledWith(commentId, undefined);
        });

        it('should return null if comment not found', async () => {
            mockCommentRepository.findByIdWithRelations.mockResolvedValue(null);

            const result = await service.getCommentWithRelations(commentId);

            expect(result).toBeNull();
        });
    });

    describe('updateComment', () => {
        const commentId = 'comment-1';
        const newContent = 'Updated content';
        const mockComment: MockComment = {
            id: commentId,
            content: 'Original content',
            taskId: 'task-1',
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
        };

        it('should update comment content', async () => {
            const updatedComment = { ...mockComment, content: newContent };
            mockCommentRepository.findOne.mockResolvedValue(mockComment);
            mockCommentRepository.update.mockResolvedValue({ affected: 1 });
            mockCommentRepository.findOne.mockResolvedValueOnce(updatedComment);

            const result = await service.updateComment(commentId, newContent);

            expect(result).toBeDefined();
            expect(mockCommentRepository.update).toHaveBeenCalledWith(commentId, { content: newContent }, undefined);
        });
    });

    describe('deleteComment', () => {
        const commentId = 'comment-1';

        it('should soft delete comment', async () => {
            mockCommentRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.deleteComment(commentId);

            expect(mockCommentRepository.softDelete).toHaveBeenCalledWith(commentId, undefined);
        });
    });

    describe('countCommentsByTaskId', () => {
        const taskId = 'task-1';

        it('should return comment count for task', async () => {
            const expectedCount = 3;
            mockCommentRepository.countByTaskId.mockResolvedValue(expectedCount);

            const result = await service.countCommentsByTaskId(taskId);

            expect(result).toBe(expectedCount);
            expect(mockCommentRepository.countByTaskId).toHaveBeenCalledWith(taskId, undefined);
        });
    });

    describe('getCommentTaskId', () => {
        const commentId = 'comment-1';
        const taskId = 'task-1';

        it('should return task ID for comment', async () => {
            mockCommentRepository.findOne.mockResolvedValue({ taskId });

            const result = await service.getCommentTaskId(commentId);

            expect(result).toBe(taskId);
            expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
                where: { id: commentId, isDeleted: false },
                select: { taskId: true },
            });
        });

        it('should return null if comment not found', async () => {
            mockCommentRepository.findOne.mockResolvedValue(null);

            const result = await service.getCommentTaskId(commentId);

            expect(result).toBeNull();
        });
    });
});
