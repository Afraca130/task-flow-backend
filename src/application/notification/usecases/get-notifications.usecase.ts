import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainNotificationService } from '@src/domain/notification/notification.service';
import { NotificationResponseDto } from '../dtos/notification-response.dto';

@Injectable()
export class GetNotificationsUseCase {
    private readonly logger = new Logger(GetNotificationsUseCase.name);

    constructor(private readonly notificationService: DomainNotificationService) {}

    async execute(userId: string): Promise<NotificationResponseDto[]> {
        this.logger.log(`Getting notifications for user: ${userId}`);

        const notifications = await this.notificationService.findAll({ where: { userId } });

        return notifications.map((notification) =>
            plainToInstance(NotificationResponseDto, notification, {
                excludeExtraneousValues: true,
            }),
        );
    }
}
