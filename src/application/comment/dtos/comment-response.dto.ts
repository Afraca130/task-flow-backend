import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class User {
    @ApiProperty({
        description: '사용자 ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
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

    @ApiPropertyOptional({
        description: '프로필 색상',
        example: '#3B82F6',
    })
    @Expose()
    profileColor?: string;
}

@Exclude()
export class CommentResponseDto {
    @ApiProperty({
        description: '댓글 ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
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
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    })
    @Expose()
    taskId: string;

    @ApiProperty({
        description: '작성자 ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    })
    @Expose()
    userId: string;

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
    @Transform(({ value }) => (value instanceof Date ? value.toISOString() : value))
    createdAt: string;

    @ApiProperty({
        description: '수정 시간',
        example: '2024-01-01T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => (value instanceof Date ? value.toISOString() : value))
    updatedAt: string;

    @ApiPropertyOptional({
        description: '작성자 정보',
        type: User,
    })
    @Expose()
    @Type(() => User)
    user?: User;

    constructor(partial: Partial<CommentResponseDto>) {
        Object.assign(this, partial);
    }
}
