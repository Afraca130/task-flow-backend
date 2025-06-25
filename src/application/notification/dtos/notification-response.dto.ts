import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class NotificationResponseDto {
    @ApiProperty({
        description: '알림 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    userId: string;

    @ApiProperty({
        description: '알림 타입',
        example: 'PROJECT_INVITATION',
    })
    @Expose()
    type: string;

    @ApiProperty({
        description: '알림 제목',
        example: '프로젝트 초대가 도착했습니다.',
    })
    @Expose()
    title: string;

    @ApiProperty({
        description: '알림 메시지',
        example: '홍길동님이 "새 프로젝트"에 초대했습니다.',
    })
    @Expose()
    message: string;

    @ApiProperty({
        description: '읽음 여부',
        example: false,
    })
    @Expose()
    isRead: boolean;

    @ApiProperty({
        description: '생성 시간',
        example: '2024-01-01T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    createdAt: string;

    @ApiPropertyOptional({
        description: '읽은 시간',
        example: '2024-01-01T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    readAt?: string;

    @ApiPropertyOptional({
        description: '추가 데이터',
        example: { projectId: 'uuid-v4-string' },
    })
    @Expose()
    data?: Record<string, any>;
}
