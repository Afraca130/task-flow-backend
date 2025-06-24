import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApprovalType } from '@src/common/enums/approval-type.enum';

export class UpdateProjectDto {
    @ApiPropertyOptional({
        description: '프로젝트 이름',
        example: '수정된 프로젝트',
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: '프로젝트 이름은 문자열이어야 합니다.' })
    @MaxLength(100, { message: '프로젝트 이름은 100자를 초과할 수 없습니다.' })
    @Transform(({ value }) => value?.trim())
    name?: string;

    @ApiPropertyOptional({
        description: '프로젝트 설명',
        example: '수정된 프로젝트 설명',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString({ message: '프로젝트 설명은 문자열이어야 합니다.' })
    @MaxLength(1000, { message: '프로젝트 설명은 1000자를 초과할 수 없습니다.' })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        description: '프로젝트 공개 여부',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '공개 여부는 boolean 값이어야 합니다.' })
    isPublic?: boolean;

    @ApiPropertyOptional({
        description: '프로젝트 시작일',
        example: '2024-02-01',
        format: 'date',
    })
    @IsOptional()
    @IsDateString({}, { message: '시작일은 유효한 날짜 형식이어야 합니다.' })
    startDate?: string;

    @ApiPropertyOptional({
        description: '프로젝트 종료일',
        example: '2024-11-30',
        format: 'date',
    })
    @IsOptional()
    @IsDateString({}, { message: '종료일은 유효한 날짜 형식이어야 합니다.' })
    endDate?: string;

    @ApiPropertyOptional({
        description: '승인 방식',
        example: ApprovalType.MANUAL,
        enum: ApprovalType,
    })
    @IsOptional()
    @IsEnum(ApprovalType, { message: '승인 방식은 AUTO 또는 MANUAL이어야 합니다.' })
    approvalType?: ApprovalType;
}
