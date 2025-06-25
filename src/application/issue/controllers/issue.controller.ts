import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { ApiDataResponse, ApiPaginatedResponse } from '@src/common/decorators/api-response.decorator';
import {
    GetIssuesUseCase,
    GetIssueUseCase,
    CreateIssueUseCase,
    CreateIssueWithMentionsUseCase,
    UpdateIssueUseCase,
    DeleteIssueUseCase,
} from '../usecases';
import {
    CreateIssueDto,
    CreateIssueWithMentionsDto,
    UpdateIssueDto,
    GetIssuesQueryDto,
    IssueResponseDto,
} from '../dtos';

@ApiTags('issues')
@Controller({ path: 'issues', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IssueController {
    constructor(
        private readonly getIssuesUseCase: GetIssuesUseCase,
        private readonly getIssueUseCase: GetIssueUseCase,
        private readonly createIssueUseCase: CreateIssueUseCase,
        private readonly createIssueWithMentionsUseCase: CreateIssueWithMentionsUseCase,
        private readonly updateIssueUseCase: UpdateIssueUseCase,
        private readonly deleteIssueUseCase: DeleteIssueUseCase,
    ) {}

    @Get()
    @ApiOperation({
        summary: '이슈 목록 조회',
        description: '필터링과 페이지네이션을 지원하는 이슈 목록을 조회합니다.',
    })
    @ApiPaginatedResponse(IssueResponseDto, {
        description: '이슈 목록 조회 성공',
    })
    async getIssues(
        @Query() query: GetIssuesQueryDto,
        @User('id') userId: string,
    ): Promise<{
        data: IssueResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        return this.getIssuesUseCase.execute(query, userId);
    }

    @Get(':id')
    @ApiOperation({
        summary: '이슈 상세 조회',
        description: '특정 이슈의 상세 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'id',
        description: '이슈 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiDataResponse(IssueResponseDto, {
        description: '이슈 조회 성공',
    })
    async getIssue(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string): Promise<IssueResponseDto> {
        return this.getIssueUseCase.execute(id, userId);
    }

    @Post()
    @ApiOperation({
        summary: '이슈 생성',
        description: '새로운 이슈를 생성합니다.',
    })
    @ApiBody({
        type: CreateIssueDto,
        description: '이슈 생성 데이터',
    })
    @ApiDataResponse(IssueResponseDto, {
        description: '이슈 생성 성공',
        status: 201,
    })
    async createIssue(@Body() dto: CreateIssueDto, @User('id') userId: string): Promise<IssueResponseDto> {
        return this.createIssueUseCase.execute(dto, userId);
    }

    @Post('with-mentions')
    @ApiOperation({
        summary: '멘션과 함께 이슈 생성',
        description: '사용자 멘션과 함께 새로운 이슈를 생성하고 알림을 발송합니다.',
    })
    @ApiBody({
        type: CreateIssueWithMentionsDto,
        description: '멘션이 포함된 이슈 생성 데이터',
    })
    @ApiDataResponse(IssueResponseDto, {
        description: '멘션과 함께 이슈 생성 성공',
        status: 201,
    })
    async createIssueWithMentions(
        @Body() dto: CreateIssueWithMentionsDto,
        @User('id') userId: string,
    ): Promise<IssueResponseDto> {
        return this.createIssueWithMentionsUseCase.execute(dto, userId);
    }

    @Put(':id')
    @ApiOperation({
        summary: '이슈 수정',
        description: '기존 이슈를 수정합니다. 작성자이거나 프로젝트 관리자만 수정할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '이슈 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiBody({
        type: UpdateIssueDto,
        description: '이슈 수정 데이터',
    })
    @ApiDataResponse(IssueResponseDto, {
        description: '이슈 수정 성공',
    })
    async updateIssue(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateIssueDto,
        @User('id') userId: string,
    ): Promise<IssueResponseDto> {
        return this.updateIssueUseCase.execute(id, dto, userId);
    }

    @Delete(':id')
    @ApiOperation({
        summary: '이슈 삭제',
        description: '기존 이슈를 삭제합니다. 작성자이거나 프로젝트 관리자만 삭제할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '이슈 ID',
        type: 'string',
        format: 'uuid',
    })
    async deleteIssue(@Param('id', ParseUUIDPipe) id: string, @User('id') userId: string): Promise<void> {
        return this.deleteIssueUseCase.execute(id, userId);
    }
}
