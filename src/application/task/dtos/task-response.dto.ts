import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { TaskStatus } from '@src/common/enums/task-status.enum';
import { TaskPriority } from '@src/common/enums/task-priority.enum';

export class TaskUserDto {
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

export class TaskProjectDto {
    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '프로젝트 이름',
        example: '태스크 관리 시스템',
    })
    @Expose()
    name: string;

    @ApiPropertyOptional({
        description: '프로젝트 설명',
        example: '효율적인 태스크 관리를 위한 시스템',
    })
    @Expose()
    description?: string;
}

@Exclude()
export class TaskResponseDto {
    @ApiProperty({
        description: '태스크 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '태스크 제목',
        example: '사용자 인증 기능 구현',
    })
    @Expose()
    title: string;

    @ApiPropertyOptional({
        description: '태스크 설명',
        example: 'JWT를 사용한 사용자 인증 시스템을 구현합니다.',
    })
    @Expose()
    description?: string;

    @ApiProperty({
        description: '태스크 상태',
        example: TaskStatus.TODO,
        enum: TaskStatus,
    })
    @Expose()
    status: TaskStatus;

    @ApiProperty({
        description: '태스크 우선순위',
        example: TaskPriority.MEDIUM,
        enum: TaskPriority,
    })
    @Expose()
    priority: TaskPriority;

    @ApiPropertyOptional({
        description: '담당자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    assigneeId?: string;

    @ApiProperty({
        description: '생성자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    assignerId: string;

    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    projectId: string;

    @ApiPropertyOptional({
        description: '마감일',
        example: '2024-12-31T23:59:59.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    dueDate?: string;

    @ApiPropertyOptional({
        description: '태그 목록',
        example: ['frontend', 'authentication', 'urgent'],
        type: [String],
    })
    @Expose()
    tags?: string[];

    @ApiProperty({
        description: 'LexoRank (정렬용)',
        example: 'n',
    })
    @Expose()
    lexoRank: string;

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
        description: '담당자 정보',
        type: TaskUserDto,
    })
    @Expose()
    @Type(() => TaskUserDto)
    assignee?: TaskUserDto;

    @ApiPropertyOptional({
        description: '생성자 정보',
        type: TaskUserDto,
    })
    @Expose()
    @Type(() => TaskUserDto)
    assigner?: TaskUserDto;

    @ApiPropertyOptional({
        description: '프로젝트 정보',
        type: TaskProjectDto,
    })
    @Expose()
    @Type(() => TaskProjectDto)
    project?: TaskProjectDto;

    // TODO: Comment 엔티티가 생성되면 추가
    // @ApiPropertyOptional({
    //     description: '댓글 목록',
    //     type: [CommentResponseDto],
    // })
    // @Expose()
    // @Type(() => CommentResponseDto)
    // comments?: CommentResponseDto[];
}
