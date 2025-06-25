import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainNotificationService } from '@src/domain/notification/notification.service';
import { UnreadCountResponseDto } from '../dtos/unread-count-response.dto';

@Injectable()
export class GetUnreadCountUseCase {
    private readonly logger = new Logger(GetUnreadCountUseCase.name);

    constructor(private readonly notificationService: DomainNotificationService) {}

    async execute(userId: string): Promise<UnreadCountResponseDto> {
        this.logger.log(`Getting unread count for user: ${userId}`);

        const unreadOptions = { where: { userId, isRead: false } };
        const totalOptions = { where: { userId } };

        const [unreadCount, totalCount, lastNotificationDate] = await Promise.all([
            this.notificationService.count(userId, unreadOptions),
            this.notificationService.count(userId, totalOptions),
            this.notificationService.findOne({
                where: { userId },
                order: { createdAt: 'DESC' },
                select: { createdAt: true },
            }),
        ]);

        const response = {
            unreadCount,
            totalCount,
            lastNotificationAt: lastNotificationDate?.createdAt?.toISOString(),
        };

        return plainToInstance(UnreadCountResponseDto, response, {
            excludeExtraneousValues: true,
        });
    }
}
