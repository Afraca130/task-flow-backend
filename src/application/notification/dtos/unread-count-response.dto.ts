import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UnreadCountResponseDto {
    @ApiProperty({
        description: '읽지 않은 알림 수',
        example: 5,
    })
    @Expose()
    unreadCount: number;

    @ApiProperty({
        description: '전체 알림 수',
        example: 20,
    })
    @Expose()
    totalCount: number;

    @ApiPropertyOptional({
        description: '마지막 알림 시간',
        example: '2024-01-01T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    lastNotificationAt?: string;
}
