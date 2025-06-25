import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInvitationDto {
    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID(4, { message: '올바른 프로젝트 ID를 입력하세요.' })
    projectId: string;

    @ApiProperty({
        description: '초대받을 사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID(4, { message: '올바른 사용자 ID를 입력하세요.' })
    inviteeId: string;

    @ApiPropertyOptional({
        description: '초대 메시지',
        example: '프로젝트에 함께 참여해주세요!',
        maxLength: 500,
    })
    @IsOptional()
    @IsString({ message: '메시지는 문자열이어야 합니다.' })
    @MaxLength(500, { message: '메시지는 최대 500자까지 입력 가능합니다.' })
    message?: string;
}
