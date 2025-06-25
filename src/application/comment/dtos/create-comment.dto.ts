import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
    @ApiProperty({
        description: '댓글 내용',
        example: '이 태스크는 언제까지 완료 예정인가요?',
        minLength: 1,
        maxLength: 1000,
    })
    @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
    @MinLength(1, { message: '댓글 내용은 최소 1자 이상이어야 합니다.' })
    @MaxLength(1000, { message: '댓글 내용은 최대 1000자까지 입력 가능합니다.' })
    @Transform(({ value }) => value?.trim())
    content: string;

    @ApiProperty({
        description: '태스크 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID(4, { message: '올바른 태스크 ID를 입력하세요.' })
    taskId: string;

    @ApiPropertyOptional({
        description: '부모 댓글 ID (대댓글인 경우)',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 부모 댓글 ID를 입력하세요.' })
    parentId?: string;
}
