import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

@Exclude()
export class ActivityLogUserDto {
    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '사용자 이름',
        example: 'John Doe',
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: '사용자 이메일',
        example: 'john.doe@example.com',
        format: 'email',
    })
    @Expose()
    email: string;
}

@Exclude()
export class ActivityLogProjectDto {
    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '프로젝트 이름',
        example: 'TaskFlow Project',
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: '프로젝트 설명',
        example: '프로젝트 관리 시스템',
    })
    @Expose()
    description: string;
}

@Exclude()
export class ActivityLogResponseDto {
    @ApiProperty({
        description: '활동 로그 ID',
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
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    projectId: string;

    @ApiProperty({
        description: '엔티티 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    entityId: string;

    @ApiProperty({
        description: '엔티티 타입',
        example: ActivityEntityType.TASK,
        enum: ActivityEntityType,
    })
    @Expose()
    entityType: ActivityEntityType;

    @ApiProperty({
        description: '액션',
        example: 'CREATE',
    })
    @Expose()
    action: string;

    @ApiProperty({
        description: '설명',
        example: '새 태스크가 생성되었습니다.',
    })
    @Expose()
    description: string;

    @ApiPropertyOptional({
        description: '메타데이터',
        example: { taskTitle: 'New Task', priority: 'HIGH' },
    })
    @Expose()
    metadata?: Record<string, any>;

    @ApiProperty({
        description: '생성일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    createdAt: string;

    @ApiPropertyOptional({
        description: '사용자 정보',
        type: ActivityLogUserDto,
    })
    @Expose()
    @Type(() => ActivityLogUserDto)
    user?: ActivityLogUserDto;

    @ApiPropertyOptional({
        description: '프로젝트 정보',
        type: ActivityLogProjectDto,
    })
    @Expose()
    @Type(() => ActivityLogProjectDto)
    project?: ActivityLogProjectDto;

    constructor(partial: Partial<ActivityLogResponseDto>) {
        Object.assign(this, partial);
    }
}
