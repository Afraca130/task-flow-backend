import { Module } from '@nestjs/common';
import { DomainActivityLogModule } from '@src/domain/activity-log/activity-log.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { ActivityLogController } from './controllers/activity-log.controller';
import { ActivityLogService } from './activity-log.service';
import { GetActivityLogsUseCase } from './usecases';

@Module({
    imports: [DomainActivityLogModule, DomainProjectMemberModule],
    controllers: [ActivityLogController],
    providers: [ActivityLogService, GetActivityLogsUseCase],
    exports: [ActivityLogService, GetActivityLogsUseCase],
})
export class ActivityLogModule {}
