import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { ProjectPriority } from '@src/common/enums/project-priority.enum';

class OwnerResponseDto {
    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
    })
    id: string;

    @ApiProperty({
        description: '사용자 이름',
        example: '홍길동',
    })
    name: string;

    @ApiProperty({
        description: '사용자 이메일',
        example: 'user@example.com',
    })
    email: string;
}

export class ProjectResponseDto {
    @ApiProperty({
        description: '프로젝트 고유 식별자',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    id: string;

    @ApiProperty({
        description: '프로젝트 이름',
        example: '새로운 프로젝트',
    })
    name: string;

    @ApiPropertyOptional({
        description: '프로젝트 설명',
        example: '이 프로젝트는 ...',
    })
    description?: string;

    @ApiProperty({
        description: '프로젝트 색상',
        example: '#3B82F6',
    })
    color: string;

    @ApiProperty({
        description: '프로젝트 우선순위',
        example: ProjectPriority.MEDIUM,
        enum: ProjectPriority,
    })
    priority: ProjectPriority;

    @ApiPropertyOptional({
        description: '프로젝트 마감일',
        example: '2024-12-31T23:59:59.000Z',
        format: 'date-time',
    })
    dueDate?: string;

    @ApiProperty({
        description: '프로젝트 활성화 상태',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: '프로젝트 소유자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    ownerId: string;

    @ApiProperty({
        description: '생성일',
        example: '2024-01-01T10:00:00Z',
        format: 'date-time',
    })
    createdAt: string;

    @ApiProperty({
        description: '수정일',
        example: '2024-01-01T10:00:00Z',
        format: 'date-time',
    })
    updatedAt: string;

    @ApiPropertyOptional({
        description: '프로젝트 멤버 수',
        example: 5,
    })
    memberCount?: number;

    @ApiPropertyOptional({
        description: '프로젝트 태스크 수',
        example: 12,
    })
    taskCount?: number;

    @ApiPropertyOptional({
        description: '공개 여부',
        example: true,
    })
    isPublic?: boolean;

    @ApiPropertyOptional({
        description: '프로젝트 소유자',
        type: OwnerResponseDto,
    })
    @Type(() => OwnerResponseDto)
    owner?: OwnerResponseDto;

    @Exclude()
    deletedAt?: Date;

    @Exclude()
    members?: any[];

    @Exclude()
    tasks?: any[];
}
