import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

export class GetActivityLogsQueryDto {
    @ApiPropertyOptional({
        description: '프로젝트 ID로 필터링',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 프로젝트 ID를 입력하세요.' })
    projectId?: string;

    @ApiPropertyOptional({
        description: '사용자 ID로 필터링',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 사용자 ID를 입력하세요.' })
    userId?: string;

    @ApiPropertyOptional({
        description: '엔티티 타입으로 필터링',
        example: ActivityEntityType.TASK,
        enum: ActivityEntityType,
    })
    @IsOptional()
    @IsEnum(ActivityEntityType, { message: '올바른 엔티티 타입을 선택하세요.' })
    entityType?: ActivityEntityType;

    @ApiPropertyOptional({
        description: '엔티티 ID로 필터링',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 엔티티 ID를 입력하세요.' })
    entityId?: string;

    @ApiPropertyOptional({
        description: '조회할 로그 수 (최대 100개)',
        example: 50,
        minimum: 1,
        maximum: 100,
        default: 50,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '로그 수는 정수여야 합니다.' })
    @Min(1, { message: '로그 수는 1 이상이어야 합니다.' })
    @Max(100, { message: '로그 수는 100 이하여야 합니다.' })
    limit?: number = 50;
}
