import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import {
    ApiOperation,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiQuery,
    ApiBadRequestResponse,
    ApiParam,
    ApiBody,
    ApiNotFoundResponse,
    ApiBearerAuth,
    ApiTags,
} from '@nestjs/swagger/dist';
import { ProjectResponseDto } from '@src/application/project/dtos';
import { PaginationData } from '@src/common/dtos';

import { UserResponseDto, SearchUsersQueryDto, UpdateUserDto } from '../dtos';
import { UserService } from '../user.service';
import { User } from '@src/common/decorators/user.decorator';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({
        summary: '사용자 목록 조회',
        description: '등록된 모든 사용자 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '사용자 목록 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UserResponseDto' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 100 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 10 },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '접근 권한이 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async getUsers(): Promise<PaginationData<UserResponseDto>> {
        return this.userService.getUsers();
    }
    @Get('search')
    @ApiOperation({
        summary: '사용자 검색',
        description: '이름 또는 이메일로 사용자를 검색합니다. 페이지네이션을 지원합니다.',
    })
    @ApiQuery({
        name: 'search',
        description: '검색할 키워드 (이름 또는 이메일에서 부분 검색)',
        required: false,
        type: 'string',
        example: '홍길동',
    })
    @ApiQuery({
        name: 'isActive',
        description: '활성화 상태 필터 (true: 활성화된 사용자만, false: 비활성화된 사용자만)',
        required: false,
        type: 'boolean',
        example: true,
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        required: false,
        type: 'number',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 아이템 수 (최대 100)',
        required: false,
        type: 'number',
        example: 10,
    })
    @ApiOkResponse({
        description: '사용자 검색 성공',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UserResponseDto' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 25 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 3 },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 (유효하지 않은 쿼리 파라미터)',
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '접근 권한이 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async searchUsers(@Query() query: SearchUsersQueryDto): Promise<PaginationData<UserResponseDto>> {
        return this.userService.searchUsers(query);
    }
    @Patch(':userId')
    @ApiOperation({
        summary: '사용자 정보 수정',
        description: '사용자의 프로필 정보를 수정합니다. 본인만 수정할 수 있습니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '수정할 사용자의 고유 식별자',
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
        type: UpdateUserDto,
        description: '수정할 사용자 정보',
        examples: {
            'profile-update': {
                summary: '프로필 정보 수정',
                description: '이름과 프로필 색상을 수정하는 예시',
                value: {
                    name: '김철수',
                    profileColor: '#FF6B6B',
                },
            },
            'project-update': {
                summary: '마지막 프로젝트 설정',
                description: '마지막 접속 프로젝트를 설정하는 예시',
                value: {
                    lastProjectId: '123e4567-e89b-12d3-a456-426614174000',
                },
            },
            'account-settings': {
                summary: '계정 설정 변경',
                description: '계정 활성화 상태를 변경하는 예시',
                value: {
                    isActive: false,
                },
            },
            'password-change': {
                summary: '비밀번호 변경',
                description: '비밀번호를 변경하는 예시',
                value: {
                    password: 'newSecurePassword123!',
                },
            },
        },
    })
    @ApiOkResponse({
        description: '사용자 정보 수정 성공',
        type: UserResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 (유효하지 않은 데이터)',
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '본인의 정보만 수정할 수 있습니다',
    })
    @ApiNotFoundResponse({
        description: '사용자 또는 프로젝트를 찾을 수 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async updateUser(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body() updateUserDto: UpdateUserDto,
        @User('id') requestUserId: string,
    ): Promise<UserResponseDto> {
        return this.userService.updateUser(userId, updateUserDto, requestUserId);
    }
    @Get(':userId/projects')
    @ApiOperation({
        summary: '사용자의 프로젝트 목록 조회',
        description: '특정 사용자가 참여하고 있는 프로젝트 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 고유 식별자',
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiOkResponse({
        description: '사용자의 프로젝트 목록 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ProjectResponseDto' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 5 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 1 },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '접근 권한이 없습니다',
    })
    @ApiNotFoundResponse({
        description: '사용자를 찾을 수 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async getUserProjects(@User('id') userId: string): Promise<PaginationData<ProjectResponseDto>> {
        return this.userService.getUserProjects(userId);
    }
}
