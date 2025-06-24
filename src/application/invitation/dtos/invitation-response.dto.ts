import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class InvitationProjectDto {
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

export class InvitationUserDto {
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
}

@Exclude()
export class ProjectInvitationResponseDto {
    @ApiProperty({
        description: '초대 ID',
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
        description: '초대자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    inviterId: string;

    @ApiProperty({
        description: '초대받을 사용자 이메일',
        example: 'invitee@example.com',
        format: 'email',
    })
    @Expose()
    inviteeEmail: string;

    @ApiPropertyOptional({
        description: '초대받은 사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    inviteeId?: string;

    @ApiProperty({
        description: '초대 상태',
        example: InvitationStatus.PENDING,
        enum: InvitationStatus,
    })
    @Expose()
    status: InvitationStatus;

    @ApiProperty({
        description: '초대 토큰',
        example: 'AbCdEf123456789...',
    })
    @Expose()
    inviteToken: string;

    @ApiPropertyOptional({
        description: '초대 메시지',
        example: '프로젝트에 함께 참여해주세요!',
    })
    @Expose()
    message?: string;

    @ApiProperty({
        description: '만료 시간',
        example: '2024-01-08T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    expiresAt: string;

    @ApiPropertyOptional({
        description: '응답 시간',
        example: '2024-01-02T10:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    respondedAt?: string;

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
        description: '프로젝트 정보',
        type: InvitationProjectDto,
    })
    @Expose()
    @Type(() => InvitationProjectDto)
    project?: InvitationProjectDto;

    @ApiPropertyOptional({
        description: '초대자 정보',
        type: InvitationUserDto,
    })
    @Expose()
    @Type(() => InvitationUserDto)
    inviter?: InvitationUserDto;

    @ApiPropertyOptional({
        description: '초대받은 사용자 정보',
        type: InvitationUserDto,
    })
    @Expose()
    @Type(() => InvitationUserDto)
    invitee?: InvitationUserDto;
}
