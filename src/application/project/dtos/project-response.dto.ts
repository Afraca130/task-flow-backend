import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { ProjectStatus } from '@src/common/enums/project-status.enum';
import { ApprovalType } from '@src/common/enums/approval-type.enum';

export class ProjectResponseDto {
    @ApiProperty({
        description: '프로젝트 고유 식별자',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    id: string;

    @Exclude()
    deletedAt: Date;

    @ApiProperty({
        description: '생성일',
        example: '2024-01-01T10:00:00Z',
        format: 'date-time',
    })
    createdAt: Date;

    @ApiProperty({
        description: '수정일',
        example: '2024-01-01T10:00:00Z',
        format: 'date-time',
    })
    updatedAt: Date;

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
        description: '프로젝트 소유자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    ownerId: string;

    @ApiProperty({
        description: '프로젝트 상태',
        example: ProjectStatus.ACTIVE,
        enum: ProjectStatus,
    })
    status: ProjectStatus;

    @ApiProperty({
        description: '공개 여부',
        example: false,
    })
    isPublic: boolean;

    @ApiPropertyOptional({
        description: '프로젝트 시작일',
        example: '2024-01-01',
        format: 'date',
    })
    @Transform(({ value }) => (value ? new Date(value).toISOString().split('T')[0] : null))
    startDate?: string;

    @ApiPropertyOptional({
        description: '프로젝트 종료일',
        example: '2024-12-31',
        format: 'date',
    })
    @Transform(({ value }) => (value ? new Date(value).toISOString().split('T')[0] : null))
    endDate?: string;

    @ApiProperty({
        description: '초대 코드',
        example: 'ABCD1234',
    })
    inviteCode: string;

    @ApiProperty({
        description: '승인 방식',
        example: ApprovalType.AUTO,
        enum: ApprovalType,
    })
    approvalType: ApprovalType;
}
