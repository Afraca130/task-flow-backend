import { Controller, Get, Put, Param, UseGuards, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { ApiDataResponse, ApiArrayResponse } from '@src/common/decorators/api-response.decorator';
import { NotificationService } from '../notification.service';
import { NotificationResponseDto, UnreadCountResponseDto, MarkAllReadResponseDto } from '../dtos';
import { ErrorResponseDto } from '@src/common/dtos/response.dto';

@ApiTags('알림')
@Controller({ path: 'notifications', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    @ApiOperation({
        summary: '알림 목록 조회',
        description: '현재 사용자의 모든 알림을 조회합니다.',
    })
    @ApiArrayResponse(NotificationResponseDto, {
        description: '알림 목록 조회가 성공적으로 완료되었습니다.',
    })
    async getNotifications(@User('id') userId: string): Promise<NotificationResponseDto[]> {
        return this.notificationService.getNotifications(userId);
    }

    @Get('unread-count')
    @ApiOperation({
        summary: '읽지 않은 알림 수 조회',
        description: '현재 사용자의 읽지 않은 알림 수와 전체 알림 수를 조회합니다.',
    })
    @ApiDataResponse(UnreadCountResponseDto, {
        description: '읽지 않은 알림 수 조회가 성공적으로 완료되었습니다.',
    })
    async getUnreadCount(@User('id') userId: string): Promise<UnreadCountResponseDto> {
        return this.notificationService.getUnreadCount(userId);
    }

    @Put(':id/read')
    @ApiOperation({
        summary: '알림 읽음 처리',
        description: '특정 알림을 읽음으로 처리합니다.',
    })
    @ApiParam({
        name: 'id',
        description: '알림 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiDataResponse(null, {
        status: HttpStatus.NO_CONTENT,
        description: '알림을 성공적으로 읽음 처리했습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '알림을 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async markAsRead(@Param('id', ParseUUIDPipe) notificationId: string, @User('id') userId: string): Promise<void> {
        return this.notificationService.markAsRead(notificationId, userId);
    }

    @Put('mark-all-read')
    @ApiOperation({
        summary: '모든 알림 읽음 처리',
        description: '현재 사용자의 모든 읽지 않은 알림을 읽음으로 처리합니다.',
    })
    @ApiDataResponse(MarkAllReadResponseDto, {
        description: '모든 알림을 성공적으로 읽음 처리했습니다.',
    })
    async markAllAsRead(@User('id') userId: string): Promise<MarkAllReadResponseDto> {
        return this.notificationService.markAllAsRead(userId);
    }
}
