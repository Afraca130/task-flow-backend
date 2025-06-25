import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { ActivityLog } from '../entities/activity-log.entity';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

export interface ActivityLogFilterOptions {
    projectId?: string;
    userId?: string;
    entityType?: ActivityEntityType;
    entityId?: string;
    limit?: number;
}

@Injectable()
export class DomainActivityLogRepository extends BaseRepository<ActivityLog> {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,
    ) {
        super(activityLogRepository);
    }

    async findWithFilters(
        filters: ActivityLogFilterOptions,
        options?: IRepositoryOptions<ActivityLog>,
    ): Promise<ActivityLog[]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        const { projectId, userId, entityType, entityId, limit = 50 } = filters;

        const queryBuilder = repository
            .createQueryBuilder('activityLog')
            .leftJoinAndSelect('activityLog.user', 'user')
            .leftJoinAndSelect('activityLog.project', 'project')
            .orderBy('activityLog.createdAt', 'DESC')
            .take(limit);

        if (projectId) {
            queryBuilder.andWhere('activityLog.projectId = :projectId', { projectId });
        }

        if (userId) {
            queryBuilder.andWhere('activityLog.userId = :userId', { userId });
        }

        if (entityType) {
            queryBuilder.andWhere('activityLog.entityType = :entityType', { entityType });
        }

        if (entityId) {
            queryBuilder.andWhere('activityLog.entityId = :entityId', { entityId });
        }

        return queryBuilder.getMany();
    }
}
