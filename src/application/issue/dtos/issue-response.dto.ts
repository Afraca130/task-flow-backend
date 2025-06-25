import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { IssueType } from '@src/common/enums/issue-type.enum';

@Exclude()
export class IssueAuthorDto {
    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '사용자 이름',
        example: 'John Doe',
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: '사용자 이메일',
        example: 'john.doe@example.com',
        format: 'email',
    })
    @Expose()
    email: string;
}

@Exclude()
export class IssueProjectDto {
    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '프로젝트 이름',
        example: 'TaskFlow Project',
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: '프로젝트 설명',
        example: '프로젝트 관리 시스템',
    })
    @Expose()
    description: string;
}

@Exclude()
export class IssueResponseDto {
    @ApiProperty({
        description: '이슈 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '이슈 제목',
        example: '로그인 버튼이 동작하지 않음',
    })
    @Expose()
    title: string;

    @ApiPropertyOptional({
        description: '이슈 설명',
        example: '로그인 페이지에서 로그인 버튼을 클릭해도 반응이 없습니다.',
    })
    @Expose()
    description?: string;

    @ApiProperty({
        description: '이슈 타입',
        example: IssueType.BUG,
        enum: IssueType,
    })
    @Expose()
    type: IssueType;

    @ApiProperty({
        description: '작성자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    authorId: string;

    @ApiProperty({
        description: '프로젝트 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    projectId: string;

    @ApiProperty({
        description: '생성일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    createdAt: string;

    @ApiProperty({
        description: '수정일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    @Expose()
    @Transform(({ value }) => value?.toISOString())
    updatedAt: string;

    @ApiPropertyOptional({
        description: '작성자 정보',
        type: IssueAuthorDto,
    })
    @Expose()
    @Type(() => IssueAuthorDto)
    author?: IssueAuthorDto;

    @ApiPropertyOptional({
        description: '프로젝트 정보',
        type: IssueProjectDto,
    })
    @Expose()
    @Type(() => IssueProjectDto)
    project?: IssueProjectDto;

    constructor(partial: Partial<IssueResponseDto>) {
        Object.assign(this, partial);
    }
}
