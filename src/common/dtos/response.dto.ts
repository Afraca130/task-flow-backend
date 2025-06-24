import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from './paginate-response.dto';

// 기본 응답 DTO
export class BaseResponseDto<T = any> {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '응답 데이터',
    })
    data: T;

    @ApiPropertyOptional({
        description: '응답 메시지',
        example: '성공적으로 처리되었습니다.',
    })
    message?: string;

    @ApiPropertyOptional({
        description: '페이지네이션 메타데이터',
        type: PaginationMetaDto,
    })
    meta?: PaginationMetaDto;

    constructor(data: T, message?: string, meta?: PaginationMetaDto) {
        this.success = true;
        this.data = data;
        this.message = message;
        this.meta = meta;
    }
}

// 에러 응답 DTO
export class ErrorResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: false,
    })
    success: boolean;

    @ApiProperty({
        description: 'HTTP 상태 코드',
        example: 400,
    })
    statusCode: number;

    @ApiProperty({
        description: '에러 메시지',
        example: '잘못된 요청입니다.',
    })
    message: string;

    @ApiPropertyOptional({
        description: '상세 에러 정보',
        type: [String],
        example: ['name should not be empty', 'email must be an email'],
    })
    details?: string[];

    @ApiProperty({
        description: '에러 발생 시간',
        example: '2024-01-01T10:00:00.000Z',
    })
    timestamp: string;

    @ApiProperty({
        description: '요청 경로',
        example: '/api/v1/users',
    })
    path: string;

    constructor(statusCode: number, message: string, path: string, details?: string[]) {
        this.success = false;
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.path = path;
    }
}
