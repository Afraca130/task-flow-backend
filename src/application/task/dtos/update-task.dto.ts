import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsArray, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskPriority } from '@src/common/enums/task-priority.enum';
import { TaskStatus } from '@src/common/enums/task-status.enum';

export class UpdateTaskDto {
    @ApiPropertyOptional({
        description: '태스크 제목',
        example: '사용자 인증 기능 구현 (수정)',
        minLength: 1,
        maxLength: 255,
    })
    @IsOptional()
    @IsString({ message: '제목은 문자열이어야 합니다.' })
    @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
    @MaxLength(255, { message: '제목은 최대 255자까지 입력 가능합니다.' })
    @Transform(({ value }) => value?.trim())
    title?: string;

    @ApiPropertyOptional({
        description: '태스크 설명',
        example: 'JWT를 사용한 사용자 인증 시스템을 구현합니다. (수정된 내용)',
    })
    @IsOptional()
    @IsString({ message: '설명은 문자열이어야 합니다.' })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        description: '태스크 상태',
        example: TaskStatus.IN_PROGRESS,
        enum: TaskStatus,
    })
    @IsOptional()
    @IsEnum(TaskStatus, { message: '올바른 상태를 선택하세요.' })
    status?: TaskStatus;

    @ApiPropertyOptional({
        description: '태스크 우선순위',
        example: TaskPriority.HIGH,
        enum: TaskPriority,
    })
    @IsOptional()
    @IsEnum(TaskPriority, { message: '올바른 우선순위를 선택하세요.' })
    priority?: TaskPriority;

    @ApiPropertyOptional({
        description: '담당자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 담당자 ID를 입력하세요.' })
    assigneeId?: string;

    @ApiPropertyOptional({
        description: '마감일',
        example: '2024-12-31T23:59:59.000Z',
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: '올바른 날짜 형식을 입력하세요.' })
    dueDate?: string;

    @ApiPropertyOptional({
        description: '태그 목록',
        example: ['frontend', 'authentication', 'high-priority'],
        type: [String],
    })
    @IsOptional()
    @IsArray({ message: '태그는 배열 형태여야 합니다.' })
    @IsString({ each: true, message: '각 태그는 문자열이어야 합니다.' })
    tags?: string[];

    @ApiPropertyOptional({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 프로젝트 ID를 입력하세요.' })
    projectId?: string;
}
