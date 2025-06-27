import { Module } from '@nestjs/common';
import { DomainNotificationModule } from '@src/domain/notification/notification.module';

// Controllers
import { NotificationController } from './controllers/notification.controller';

// Services
import { NotificationService } from './notification.service';

// Use Cases
import {
    GetNotificationsUseCase,
    GetUnreadCountUseCase,
    MarkNotificationReadUseCase,
    MarkAllReadUseCase,
} from './usecases';

@Module({
    imports: [DomainNotificationModule],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        // Use Cases
        GetNotificationsUseCase,
        GetUnreadCountUseCase,
        MarkNotificationReadUseCase,
        MarkAllReadUseCase,
    ],
    exports: [NotificationService],
})
export class NotificationModule {}
