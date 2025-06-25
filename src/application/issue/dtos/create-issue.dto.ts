import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsEnum, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IssueType } from '@src/common/enums/issue-type.enum';

export class CreateIssueDto {
    @ApiProperty({
        description: '이슈 제목',
        example: '로그인 버튼이 동작하지 않음',
        minLength: 1,
        maxLength: 255,
    })
    @IsString({ message: '제목은 문자열이어야 합니다.' })
    @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
    @MaxLength(255, { message: '제목은 최대 255자까지 입력 가능합니다.' })
    @Transform(({ value }) => value?.trim())
    title: string;

    @ApiPropertyOptional({
        description: '이슈 설명',
        example: '로그인 페이지에서 로그인 버튼을 클릭해도 반응이 없습니다.',
    })
    @IsOptional()
    @IsString({ message: '설명은 문자열이어야 합니다.' })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        description: '이슈 타입',
        example: IssueType.BUG,
        enum: IssueType,
        default: IssueType.BUG,
    })
    @IsOptional()
    @IsEnum(IssueType, { message: '올바른 이슈 타입을 선택하세요.' })
    type?: IssueType = IssueType.BUG;

    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID(4, { message: '올바른 프로젝트 ID를 입력하세요.' })
    projectId: string;
}
