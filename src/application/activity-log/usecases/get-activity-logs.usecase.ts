import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { GetActivityLogsQueryDto } from '../dtos/get-activity-logs-query.dto';
import { ActivityLogResponseDto } from '../dtos/activity-log-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetActivityLogsUseCase {
    private readonly logger = new Logger(GetActivityLogsUseCase.name);

    constructor(
        private readonly activityLogService: DomainActivityLogService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(query: GetActivityLogsQueryDto, userId: string): Promise<ActivityLogResponseDto[]> {
        try {
            this.logger.log(`Getting activity logs with query: ${JSON.stringify(query)}`);

            // 프로젝트가 지정된 경우 멤버십 확인
            if (query.projectId) {
                const hasAccess = await this.projectMemberService.hasPermission(query.projectId, userId);
                if (!hasAccess) {
                    throw new ForbiddenException('해당 프로젝트의 멤버만 활동 로그를 조회할 수 있습니다.');
                }
            }

            const activityLogs = await this.activityLogService.getActivityLogsWithFilters({
                projectId: query.projectId,
                userId: query.userId,
                entityType: query.entityType,
                entityId: query.entityId,
                limit: query.limit,
            });

            const activityLogResponseDtos = activityLogs.map((log) =>
                plainToInstance(ActivityLogResponseDto, log, { excludeExtraneousValues: true }),
            );

            this.logger.log(`Successfully retrieved ${activityLogs.length} activity logs`);
            return activityLogResponseDtos;
        } catch (error) {
            this.logger.error(`Failed to get activity logs: ${error.message}`, error.stack);
            throw error;
        }
    }
}
