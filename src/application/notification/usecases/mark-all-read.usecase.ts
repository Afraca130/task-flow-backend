import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainNotificationService } from '@src/domain/notification/notification.service';
import { MarkAllReadResponseDto } from '../dtos/mark-all-read-response.dto';

@Injectable()
export class MarkAllReadUseCase {
    private readonly logger = new Logger(MarkAllReadUseCase.name);

    constructor(private readonly notificationService: DomainNotificationService) {}

    async execute(userId: string): Promise<MarkAllReadResponseDto> {
        this.logger.log(`Marking all notifications as read for user: ${userId}`);

        const count = await this.notificationService.markAllAsRead(userId);

        const response = {
            message: '모든 알림을 읽음으로 처리했습니다.',
            count,
        };

        return plainToInstance(MarkAllReadResponseDto, response, {
            excludeExtraneousValues: true,
        });
    }
}
