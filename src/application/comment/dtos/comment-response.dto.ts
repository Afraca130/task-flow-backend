import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class CommentUserDto {
    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '사용자 이름',
        example: '홍길동',
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: '사용자 이메일',
        example: 'user@example.com',
        format: 'email',
    })
    @Expose()
    email: string;
}

@Exclude()
export class CommentResponseDto {
    @ApiProperty({
        description: '댓글 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '댓글 내용',
        example: '이 태스크는 언제까지 완료 예정인가요?',
    })
    @Expose()
    content: string;

    @ApiProperty({
        description: '태스크 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    taskId: string;

    @ApiProperty({
        description: '작성자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    userId: string;

    @ApiPropertyOptional({
        description: '부모 댓글 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    parentId?: string;

    @ApiProperty({
        description: '삭제 여부',
        example: false,
    })
    @Expose()
    isDeleted: boolean;

    @ApiProperty({
        description: '생성 시간',
        example: '2024-01-01T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    createdAt: string;

    @ApiProperty({
        description: '수정 시간',
        example: '2024-01-01T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    updatedAt: string;

    @ApiPropertyOptional({
        description: '작성자 정보',
        type: CommentUserDto,
    })
    @Expose()
    @Type(() => CommentUserDto)
    user?: CommentUserDto;

    @ApiPropertyOptional({
        description: '답글 목록',
        type: [CommentResponseDto],
    })
    @Expose()
    @Type(() => CommentResponseDto)
    replies?: CommentResponseDto[];

    @ApiPropertyOptional({
        description: '부모 댓글 정보',
        type: CommentResponseDto,
    })
    @Expose()
    @Type(() => CommentResponseDto)
    parent?: CommentResponseDto;
}
