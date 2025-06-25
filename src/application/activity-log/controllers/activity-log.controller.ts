import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { ApiArrayResponse } from '@src/common/decorators/api-response.decorator';
import { GetActivityLogsUseCase } from '../usecases';
import { GetActivityLogsQueryDto, ActivityLogResponseDto } from '../dtos';

@ApiTags('activity-logs')
@Controller({ path: 'activity-logs', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivityLogController {
    constructor(private readonly getActivityLogsUseCase: GetActivityLogsUseCase) {}

    @Get()
    @ApiOperation({
        summary: '활동 로그 조회',
        description: '프로젝트의 활동 로그를 조회합니다. 프로젝트 멤버만 조회할 수 있습니다.',
    })
    @ApiArrayResponse(ActivityLogResponseDto, {
        description: '활동 로그 조회 성공',
    })
    async getActivityLogs(
        @Query() query: GetActivityLogsQueryDto,
        @User('id') userId: string,
    ): Promise<ActivityLogResponseDto[]> {
        return this.getActivityLogsUseCase.execute(query, userId);
    }
}
