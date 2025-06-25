import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCommentDto {
    @ApiProperty({
        description: '수정할 댓글 내용',
        example: '수정된 댓글 내용입니다.',
        minLength: 1,
        maxLength: 1000,
    })
    @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
    @MinLength(1, { message: '댓글 내용은 최소 1자 이상이어야 합니다.' })
    @MaxLength(1000, { message: '댓글 내용은 최대 1000자까지 입력 가능합니다.' })
    @Transform(({ value }) => value?.trim())
    content: string;
}
