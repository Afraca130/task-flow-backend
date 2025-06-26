import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: '사용자 이름',
        example: '홍길동',
        minLength: 2,
        maxLength: 50,
    })
    @IsOptional()
    @IsString({ message: '이름은 문자열이어야 합니다' })
    @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
    @MaxLength(50, { message: '이름은 최대 50자까지 입력 가능합니다' })
    @Transform(({ value }) => value?.trim())
    readonly name?: string;

    @ApiPropertyOptional({
        description: '비밀번호',
        example: 'newPassword123!',
        minLength: 8,
        maxLength: 128,
    })
    @IsOptional()
    @IsString({ message: '비밀번호는 문자열이어야 합니다' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
    @MaxLength(128, { message: '비밀번호는 최대 128자까지 입력 가능합니다' })
    readonly password?: string;

    @ApiPropertyOptional({
        description: '프로필 색상 (HEX 코드)',
        example: '#3B82F6',
        pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    })
    @IsOptional()
    @IsString({ message: '프로필 색상은 문자열이어야 합니다' })
    @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: '프로필 색상은 올바른 HEX 색상 코드여야 합니다 (예: #3B82F6)',
    })
    readonly profileColor?: string;

    @ApiPropertyOptional({
        description: '계정 활성화 상태',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '활성화 상태는 boolean 값이어야 합니다' })
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    readonly isActive?: boolean;

    @ApiPropertyOptional({
        description: '마지막 접속 프로젝트 ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '프로젝트 ID는 올바른 UUID 형식이어야 합니다' })
    readonly lastProjectId?: string;
}
