import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { Notification } from '../entities/notification.entity';
import { DomainNotificationRepository } from './notification.repository';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainNotificationService extends BaseService<Notification> {
    constructor(private readonly notificationRepository: DomainNotificationRepository) {
        super(notificationRepository);
    }

    async count(userId: string, options?: IRepositoryOptions<Notification>): Promise<number> {
        return this.notificationRepository.count(userId, options);
    }

    async markAsRead(
        notificationId: string,
        userId: string,
        options?: IRepositoryOptions<Notification>,
    ): Promise<void> {
        const notification = await this.findOne({
            where: { id: notificationId, userId },
            ...options,
        });

        if (notification && !notification.isRead) {
            await this.update(notificationId, { isRead: true, readAt: new Date() }, options);
        }
    }

    async markAllAsRead(userId: string, options?: IRepositoryOptions<Notification>): Promise<number> {
        return this.notificationRepository.markAllAsRead(userId, options);
    }
}
