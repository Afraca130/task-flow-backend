import { Injectable } from '@nestjs/common';
import { NotificationResponseDto, UnreadCountResponseDto, MarkAllReadResponseDto } from './dtos';
import {
    GetNotificationsUseCase,
    GetUnreadCountUseCase,
    MarkNotificationReadUseCase,
    MarkAllReadUseCase,
} from './usecases';

@Injectable()
export class NotificationService {
    constructor(
        private readonly getNotificationsUseCase: GetNotificationsUseCase,
        private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
        private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
        private readonly markAllReadUseCase: MarkAllReadUseCase,
    ) {}

    async getNotifications(userId: string): Promise<NotificationResponseDto[]> {
        return this.getNotificationsUseCase.execute(userId);
    }

    async getUnreadCount(userId: string): Promise<UnreadCountResponseDto> {
        return this.getUnreadCountUseCase.execute(userId);
    }

    async markAsRead(notificationId: string, userId: string): Promise<void> {
        return this.markNotificationReadUseCase.execute(notificationId, userId);
    }

    async markAllAsRead(userId: string): Promise<MarkAllReadResponseDto> {
        return this.markAllReadUseCase.execute(userId);
    }
}
