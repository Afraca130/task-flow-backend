import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IssueType } from '@src/common/enums/issue-type.enum';

export class UpdateIssueDto {
    @ApiPropertyOptional({
        description: '이슈 제목',
        example: '수정된 이슈 제목',
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
        description: '이슈 설명',
        example: '수정된 이슈 설명',
    })
    @IsOptional()
    @IsString({ message: '설명은 문자열이어야 합니다.' })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        description: '이슈 타입',
        example: IssueType.FEATURE,
        enum: IssueType,
    })
    @IsOptional()
    @IsEnum(IssueType, { message: '올바른 이슈 타입을 선택하세요.' })
    type?: IssueType;
}
