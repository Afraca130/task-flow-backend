import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IssueType } from '@src/common/enums/issue-type.enum';

export class GetIssuesQueryDto {
    @ApiPropertyOptional({
        description: '프로젝트 ID로 필터링',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 프로젝트 ID를 입력하세요.' })
    projectId?: string;

    @ApiPropertyOptional({
        description: '이슈 타입으로 필터링',
        example: IssueType.BUG,
        enum: IssueType,
    })
    @IsOptional()
    @IsEnum(IssueType, { message: '올바른 이슈 타입을 선택하세요.' })
    type?: IssueType;

    @ApiPropertyOptional({
        description: '작성자 ID로 필터링',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 작성자 ID를 입력하세요.' })
    authorId?: string;

    @ApiPropertyOptional({
        description: '검색어 (제목 또는 설명에서 검색)',
        example: '로그인',
    })
    @IsOptional()
    @IsString({ message: '검색어는 문자열이어야 합니다.' })
    @Transform(({ value }) => value?.trim())
    search?: string;

    @ApiPropertyOptional({
        description: '페이지 번호',
        example: 1,
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '페이지 번호는 정수여야 합니다.' })
    @Min(1, { message: '페이지 번호는 1 이상이어야 합니다.' })
    page?: number = 1;

    @ApiPropertyOptional({
        description: '페이지당 항목 수',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '페이지당 항목 수는 정수여야 합니다.' })
    @Min(1, { message: '페이지당 항목 수는 1 이상이어야 합니다.' })
    @Max(100, { message: '페이지당 항목 수는 100 이하여야 합니다.' })
    limit?: number = 20;
}
