import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { ActivityLog } from '../entities/activity-log.entity';
import { DomainActivityLogRepository, ActivityLogFilterOptions } from './activity-log.repository';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainActivityLogService extends BaseService<ActivityLog> {
    constructor(private readonly activityLogRepository: DomainActivityLogRepository) {
        super(activityLogRepository);
    }

    async getActivityLogsWithFilters(
        filters: ActivityLogFilterOptions,
        options?: IRepositoryOptions<ActivityLog>,
    ): Promise<ActivityLog[]> {
        return this.activityLogRepository.findWithFilters(filters, options);
    }

    async logActivity(
        userId: string,
        projectId: string,
        entityId: string,
        entityType: ActivityEntityType,
        action: string,
        description: string,
        metadata?: Record<string, any>,
        options?: IRepositoryOptions<ActivityLog>,
    ): Promise<ActivityLog> {
        const activityData = {
            userId,
            projectId,
            entityId,
            entityType,
            action,
            description,
            metadata,
        };

        return this.save(activityData, options);
    }
}
