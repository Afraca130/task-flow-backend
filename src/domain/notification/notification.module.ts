import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { DomainNotificationRepository } from './notification.repository';
import { DomainNotificationService } from './notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    providers: [DomainNotificationRepository, DomainNotificationService],
    exports: [DomainNotificationRepository, DomainNotificationService],
})
export class NotificationModule {}
