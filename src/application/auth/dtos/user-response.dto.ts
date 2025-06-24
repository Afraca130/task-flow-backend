import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist';
import { Exclude } from 'class-transformer';

export class UserDto {
    @ApiProperty({
        description: '사용자 ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: '계정 생성 시간',
        example: '2023-12-01T12:00:00.000Z',
    })
    createdAt: string;

    @ApiProperty({
        description: '수정 시간',
        example: '2023-12-01T12:00:00.000Z',
    })
    updatedAt: string;

    @ApiProperty({
        description: '이메일 주소',
        example: 'user@example.com',
    })
    email: string;

    @Exclude()
    password: string;

    @ApiProperty({
        description: '사용자 이름',
        example: '홍길동',
    })
    name: string;

    @ApiPropertyOptional({
        description: '프로필 색상 (HEX 코드)',
        example: '#3B82F6',
    })
    profileColor?: string;

    @ApiProperty({
        description: '계정 활성화 상태',
        example: true,
    })
    isActive: boolean;

    @ApiPropertyOptional({
        description: '마지막 로그인 시간',
        example: '2023-12-01T12:00:00.000Z',
    })
    lastLoginAt?: string;
}
