import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsArray, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { CreateIssueDto } from './create-issue.dto';

export class CreateIssueWithMentionsDto {
    @ApiProperty({
        description: '이슈 생성 데이터',
        type: CreateIssueDto,
    })
    @IsObject({ message: '이슈 데이터는 객체여야 합니다.' })
    @ValidateNested()
    @Type(() => CreateIssueDto)
    issue: CreateIssueDto;

    @ApiPropertyOptional({
        description: '멘션할 사용자 ID 목록',
        example: ['uuid-v4-string-1', 'uuid-v4-string-2'],
        type: [String],
    })
    @IsOptional()
    @IsArray({ message: '멘션할 사용자 ID는 배열이어야 합니다.' })
    @IsUUID(4, { each: true, message: '모든 사용자 ID는 올바른 UUID 형식이어야 합니다.' })
    mentionedUserIds?: string[] = [];
}
