import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TaskStatus } from '@src/common/enums/task-status.enum';

export class GetTasksQueryDto {
    @ApiPropertyOptional({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 프로젝트 ID를 입력하세요.' })
    projectId?: string;

    @ApiPropertyOptional({
        description: '담당자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 담당자 ID를 입력하세요.' })
    assigneeId?: string;

    @ApiPropertyOptional({
        description: '태스크 상태',
        example: TaskStatus.TODO,
        enum: TaskStatus,
    })
    @IsOptional()
    @IsEnum(TaskStatus, { message: '올바른 상태를 선택하세요.' })
    status?: TaskStatus;

    @ApiPropertyOptional({
        description: '검색어 (제목 또는 설명)',
        example: '인증',
    })
    @IsOptional()
    @IsString({ message: '검색어는 문자열이어야 합니다.' })
    @Transform(({ value }) => value?.trim())
    search?: string;

    @ApiPropertyOptional({
        description: '페이지 번호',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: '페이지 번호는 숫자여야 합니다.' })
    @Min(1, { message: '페이지 번호는 1 이상이어야 합니다.' })
    page?: number = 1;

    @ApiPropertyOptional({
        description: '페이지당 항목 수',
        example: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: '페이지당 항목 수는 숫자여야 합니다.' })
    @Min(1, { message: '페이지당 항목 수는 1 이상이어야 합니다.' })
    @Max(100, { message: '페이지당 항목 수는 100 이하여야 합니다.' })
    limit?: number = 20;

    @ApiPropertyOptional({
        description: 'LexoRank (정렬용)',
        example: 'n',
    })
    @IsOptional()
    @IsString({ message: 'LexoRank는 문자열이어야 합니다.' })
    lexoRank?: string;
}
