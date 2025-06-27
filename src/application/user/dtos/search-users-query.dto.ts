import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '@src/common/dtos';

export class SearchUsersQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: '검색할 키워드 (이름 또는 이메일)',
        example: '홍길동',
        minLength: 1,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: '검색 키워드는 문자열이어야 합니다' })
    @MinLength(1, { message: '검색 키워드는 최소 1자 이상이어야 합니다' })
    @MaxLength(100, { message: '검색 키워드는 최대 100자까지 입력 가능합니다' })
    @Transform(({ value }) => value?.trim())
    readonly search?: string;

    @ApiPropertyOptional({
        description: '활성화 상태 필터',
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    readonly isActive?: boolean;
}
