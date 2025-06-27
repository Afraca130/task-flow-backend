import { Test, TestingModule } from '@nestjs/testing';
import { DomainNotificationService } from '../../src/domain/notification/notification.service';
import { DomainNotificationRepository } from '../../src/domain/notification/notification.repository';
import { Notification } from '../../src/domain/entities/notification.entity';

interface MockNotification extends Partial<Notification> {
    id: string;
    userId: string;
    type: string;
    content: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

describe('DomainNotificationService', () => {
    let service: DomainNotificationService;
    let notificationRepository: DomainNotificationRepository;

    const mockNotificationRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
        markAllAsRead: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DomainNotificationService,
                {
                    provide: DomainNotificationRepository,
                    useValue: mockNotificationRepository,
                },
            ],
        }).compile();

        service = module.get<DomainNotificationService>(DomainNotificationService);
        notificationRepository = module.get<DomainNotificationRepository>(DomainNotificationRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('count', () => {
        const userId = 'user-1';

        it('should return notification count for user', async () => {
            const expectedCount = 5;
            mockNotificationRepository.count.mockResolvedValue(expectedCount);

            const result = await service.count(userId);

            expect(result).toBe(expectedCount);
            expect(mockNotificationRepository.count).toHaveBeenCalledWith(userId, undefined);
        });
    });

    describe('markAsRead', () => {
        const notificationId = 'notification-1';
        const userId = 'user-1';
        const mockNotification: MockNotification = {
            id: notificationId,
            userId,
            type: 'TASK_ASSIGNED',
            content: 'You have been assigned a task',
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should mark notification as read', async () => {
            mockNotificationRepository.findOne.mockResolvedValue(mockNotification);
            mockNotificationRepository.update.mockResolvedValue({ affected: 1 });

            await service.markAsRead(notificationId, userId);

            expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({
                where: { id: notificationId, userId },
            });
            expect(mockNotificationRepository.update).toHaveBeenCalledWith(
                notificationId,
                {
                    isRead: true,
                    readAt: expect.any(Date),
                },
                undefined,
            );
        });

        it('should not update if notification is already read', async () => {
            const readNotification = { ...mockNotification, isRead: true, readAt: new Date() };
            mockNotificationRepository.findOne.mockResolvedValue(readNotification);

            await service.markAsRead(notificationId, userId);

            expect(mockNotificationRepository.update).not.toHaveBeenCalled();
        });

        it('should not update if notification is not found', async () => {
            mockNotificationRepository.findOne.mockResolvedValue(null);

            await service.markAsRead(notificationId, userId);

            expect(mockNotificationRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('markAllAsRead', () => {
        const userId = 'user-1';

        it('should mark all notifications as read', async () => {
            const affectedCount = 3;
            mockNotificationRepository.markAllAsRead.mockResolvedValue(affectedCount);

            const result = await service.markAllAsRead(userId);

            expect(result).toBe(affectedCount);
            expect(mockNotificationRepository.markAllAsRead).toHaveBeenCalledWith(userId, undefined);
        });
    });
});
