import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class ProjectMemberUserDto {
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

    @ApiPropertyOptional({
        description: '프로필 색상',
        example: '#3B82F6',
    })
    @Expose()
    profileColor?: string;

    @ApiProperty({
        description: '계정 활성화 상태',
        example: true,
    })
    @Expose()
    isActive: boolean;
}

export class ProjectMemberProjectDto {
    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '프로젝트 이름',
        example: '새로운 프로젝트',
    })
    @Expose()
    name: string;

    @ApiPropertyOptional({
        description: '프로젝트 설명',
        example: '이 프로젝트는 ...',
    })
    @Expose()
    description?: string;
}

@Exclude()
export class ProjectMemberResponseDto {
    @ApiProperty({
        description: '멤버 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    projectId: string;

    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    userId: string;

    @ApiProperty({
        description: '멤버 역할',
        example: ProjectMemberRole.MEMBER,
        enum: ProjectMemberRole,
    })
    @Expose()
    role: ProjectMemberRole;

    @ApiProperty({
        description: '프로젝트 참여 시간',
        example: '2024-01-01T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    joinedAt: string;

    @ApiPropertyOptional({
        description: '초대한 사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    invitedBy?: string;

    @ApiProperty({
        description: '멤버 활성화 상태',
        example: true,
    })
    @Expose()
    isActive: boolean;

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
        description: '사용자 정보',
        type: ProjectMemberUserDto,
    })
    @Expose()
    @Type(() => ProjectMemberUserDto)
    user?: ProjectMemberUserDto;

    @ApiPropertyOptional({
        description: '프로젝트 정보',
        type: ProjectMemberProjectDto,
    })
    @Expose()
    @Type(() => ProjectMemberProjectDto)
    project?: ProjectMemberProjectDto;

    @ApiPropertyOptional({
        description: '초대한 사용자 정보',
        type: ProjectMemberUserDto,
    })
    @Expose()
    @Type(() => ProjectMemberUserDto)
    inviter?: ProjectMemberUserDto;
}
