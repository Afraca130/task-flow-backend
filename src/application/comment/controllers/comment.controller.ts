import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiForbiddenResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { ApiDataResponse, ApiArrayResponse } from '@src/common/decorators/api-response.decorator';
import { CommentService } from '../comment.service';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from '../dtos';
import { ErrorResponseDto } from '@src/common/dtos/response.dto';

@ApiTags('댓글')
@Controller({ path: 'comments', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @ApiOperation({
        summary: '댓글 생성',
        description: '새로운 댓글 또는 대댓글을 생성합니다. 프로젝트 멤버만 생성할 수 있습니다.',
    })
    @ApiBody({
        type: CreateCommentDto,
        description: '댓글 생성 정보',
    })
    @ApiDataResponse(CommentResponseDto, {
        status: HttpStatus.CREATED,
        description: '댓글이 성공적으로 생성되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '태스크 또는 부모 댓글을 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '댓글을 생성할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiBadRequestResponse({
                description: '잘못된 요청입니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @User('id') userId: string,
    ): Promise<CommentResponseDto> {
        return this.commentService.createComment(createCommentDto, userId);
    }

    @Get('task/:taskId')
    @ApiOperation({
        summary: '태스크 댓글 조회',
        description: '특정 태스크의 모든 댓글과 대댓글을 조회합니다.',
    })
    @ApiParam({
        name: 'taskId',
        description: '태스크 ID',
        format: 'uuid',
    })
    @ApiArrayResponse(CommentResponseDto, {
        description: '태스크 댓글 목록 조회가 성공적으로 완료되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '태스크를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '태스크 댓글을 조회할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getTaskComments(
        @Param('taskId', ParseUUIDPipe) taskId: string,
        @User('id') userId: string,
    ): Promise<CommentResponseDto[]> {
        return this.commentService.getTaskComments(taskId, userId);
    }

    @Put(':id')
    @ApiOperation({
        summary: '댓글 수정',
        description: '댓글 내용을 수정합니다. 댓글 작성자 또는 프로젝트 매니저만 수정할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '댓글 ID',
        format: 'uuid',
    })
    @ApiBody({
        type: UpdateCommentDto,
        description: '수정할 댓글 정보',
    })
    @ApiDataResponse(CommentResponseDto, {
        description: '댓글이 성공적으로 수정되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '댓글을 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '댓글을 수정할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async updateComment(
        @Param('id', ParseUUIDPipe) commentId: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @User('id') userId: string,
    ): Promise<CommentResponseDto> {
        return this.commentService.updateComment(commentId, updateCommentDto, userId);
    }

    @Delete(':id')
    @ApiOperation({
        summary: '댓글 삭제',
        description: '댓글을 삭제합니다. 댓글 작성자 또는 프로젝트 매니저만 삭제할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '댓글 ID',
        format: 'uuid',
    })
    @ApiDataResponse(null, {
        status: HttpStatus.NO_CONTENT,
        description: '댓글이 성공적으로 삭제되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '댓글을 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '댓글을 삭제할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async deleteComment(@Param('id', ParseUUIDPipe) commentId: string, @User('id') userId: string): Promise<void> {
        return this.commentService.deleteComment(commentId, userId);
    }
}
