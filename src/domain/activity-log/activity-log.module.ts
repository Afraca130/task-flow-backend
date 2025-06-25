import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from '../entities/activity-log.entity';
import { DomainActivityLogRepository } from './activity-log.repository';
import { DomainActivityLogService } from './activity-log.service';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog])],
    providers: [DomainActivityLogRepository, DomainActivityLogService],
    exports: [DomainActivityLogRepository, DomainActivityLogService],
})
export class DomainActivityLogModule {}
