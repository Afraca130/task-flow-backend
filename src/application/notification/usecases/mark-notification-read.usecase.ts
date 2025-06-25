import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainNotificationService } from '@src/domain/notification/notification.service';

@Injectable()
export class MarkNotificationReadUseCase {
    private readonly logger = new Logger(MarkNotificationReadUseCase.name);

    constructor(private readonly notificationService: DomainNotificationService) {}

    async execute(notificationId: string, userId: string): Promise<void> {
        this.logger.log(`Marking notification as read: ${notificationId} for user: ${userId}`);

        const notification = await this.notificationService.findOne({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new NotFoundException('알림을 찾을 수 없습니다.');
        }

        if (notification.userId !== userId) {
            throw new ForbiddenException('이 알림에 접근할 권한이 없습니다.');
        }

        await this.notificationService.markAsRead(notificationId, userId);
    }
}
