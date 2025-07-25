import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsDateString,
    MaxLength,
    IsHexColor,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ProjectPriority } from '@src/common/enums/project-priority.enum';

export class CreateProjectDto {
    @ApiProperty({
        description: '프로젝트 이름',
        example: '새로운 프로젝트',
        maxLength: 100,
    })
    @IsString({ message: '프로젝트 이름은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '프로젝트 이름은 필수입니다.' })
    @MaxLength(100, { message: '프로젝트 이름은 100자를 초과할 수 없습니다.' })
    @Transform(({ value }) => value?.trim())
    name: string;

    @ApiPropertyOptional({
        description: '프로젝트 설명',
        example: '이 프로젝트는 ...',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString({ message: '프로젝트 설명은 문자열이어야 합니다.' })
    @MaxLength(1000, { message: '프로젝트 설명은 1000자를 초과할 수 없습니다.' })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        description: '프로젝트 색상 (HEX 코드)',
        example: '#3B82F6',
        default: '#3B82F6',
    })
    @IsOptional()
    @IsString({ message: '색상은 문자열이어야 합니다.' })
    @IsHexColor({ message: '유효한 HEX 색상 코드를 입력해주세요.' })
    color?: string = '#3B82F6';

    @ApiPropertyOptional({
        description: '프로젝트 우선순위',
        example: ProjectPriority.MEDIUM,
        enum: ProjectPriority,
        default: ProjectPriority.MEDIUM,
    })
    @IsOptional()
    @IsEnum(ProjectPriority, { message: '우선순위는 LOW, MEDIUM, HIGH, URGENT 중 하나여야 합니다.' })
    priority?: ProjectPriority = ProjectPriority.MEDIUM;

    @ApiPropertyOptional({
        description: '프로젝트 마감일',
        example: '2024-12-31T23:59:59.000Z',
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: '마감일은 유효한 날짜 형식이어야 합니다.' })
    dueDate?: string;

    @ApiPropertyOptional({
        description: '프로젝트 활성화 상태',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: '활성화 상태는 boolean 값이어야 합니다.' })
    isActive?: boolean = true;

    @ApiPropertyOptional({
        description: '프로젝트 공개 여부',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: '공개 여부는 boolean 값이어야 합니다.' })
    isPublic?: boolean = true;
}
