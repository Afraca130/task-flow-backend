import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { Notification } from '../entities/notification.entity';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainNotificationRepository extends BaseRepository<Notification> {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) {
        super(notificationRepository);
    }

    async count(userId: string, options?: IRepositoryOptions<Notification>): Promise<number> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.count(options);
    }

    async markAllAsRead(userId: string, options?: IRepositoryOptions<Notification>): Promise<number> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        const result = await repository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });

        return result.affected || 0;
    }
}
