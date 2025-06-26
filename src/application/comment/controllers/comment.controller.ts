import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiBearerAuth,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiForbiddenResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { CommentService } from '../comment.service';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from '../dtos';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @ApiOperation({
        summary: '댓글 생성',
        description: '새로운 댓글 또는 대댓글을 생성합니다.',
    })
    @ApiBody({
        type: CreateCommentDto,
        description: '댓글 생성 정보',
        examples: {
            'basic-comment': {
                summary: '일반 댓글',
                description: '태스크에 새로운 댓글을 추가',
                value: {
                    taskId: '123e4567-e89b-12d3-a456-426614174000',
                    content: '이 작업은 언제 완료될 예정인가요?',
                },
            },
            'reply-comment': {
                summary: '대댓글',
                description: '기존 댓글에 대한 답글',
                value: {
                    taskId: '123e4567-e89b-12d3-a456-426614174000',
                    content: '내일까지 완료 예정입니다.',
                    parentId: '456e7890-e89b-12d3-a456-426614174000',
                },
            },
        },
    })
    @ApiCreatedResponse({
        description: '댓글이 성공적으로 생성되었습니다',
        type: CommentResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '댓글을 생성할 권한이 없습니다',
    })
    @ApiNotFoundResponse({
        description: '태스크를 찾을 수 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @User('id') userId: string,
    ): Promise<CommentResponseDto> {
        return this.commentService.createComment(createCommentDto, userId);
    }

    @Get('task/:taskId')
    @ApiOperation({
        summary: '태스크 댓글 목록 조회',
        description: '특정 태스크의 모든 댓글을 조회합니다.',
    })
    @ApiParam({
        name: 'taskId',
        description: '태스크 고유 식별자',
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiOkResponse({
        description: '태스크 댓글 목록 조회 성공',
        type: [CommentResponseDto],
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '태스크 댓글을 조회할 권한이 없습니다',
    })
    @ApiNotFoundResponse({
        description: '태스크를 찾을 수 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async getTaskComments(
        @Param('taskId', ParseUUIDPipe) taskId: string,
        @User('id') userId: string,
    ): Promise<CommentResponseDto[]> {
        return this.commentService.getTaskComments(taskId, userId);
    }

    @Put(':commentId')
    @ApiOperation({
        summary: '댓글 수정',
        description: '댓글 내용을 수정합니다. 댓글 작성자만 수정할 수 있습니다.',
    })
    @ApiParam({
        name: 'commentId',
        description: '댓글 고유 식별자',
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
        type: UpdateCommentDto,
        description: '수정할 댓글 내용',
        examples: {
            'update-content': {
                summary: '댓글 내용 수정',
                description: '댓글의 내용을 수정하는 예시',
                value: {
                    content: '수정된 댓글 내용입니다.',
                },
            },
        },
    })
    @ApiOkResponse({
        description: '댓글이 성공적으로 수정되었습니다',
        type: CommentResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '댓글을 수정할 권한이 없습니다',
    })
    @ApiNotFoundResponse({
        description: '댓글을 찾을 수 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async updateComment(
        @Param('commentId', ParseUUIDPipe) commentId: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @User('id') userId: string,
    ): Promise<CommentResponseDto> {
        return this.commentService.updateComment(commentId, updateCommentDto, userId);
    }

    @Delete(':commentId')
    @ApiOperation({
        summary: '댓글 삭제',
        description: '댓글을 삭제합니다. 댓글 작성자만 삭제할 수 있습니다.',
    })
    @ApiParam({
        name: 'commentId',
        description: '댓글 고유 식별자',
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiNoContentResponse({
        description: '댓글이 성공적으로 삭제되었습니다',
    })
    @ApiUnauthorizedResponse({
        description: '인증이 필요합니다',
    })
    @ApiForbiddenResponse({
        description: '댓글을 삭제할 권한이 없습니다',
    })
    @ApiNotFoundResponse({
        description: '댓글을 찾을 수 없습니다',
    })
    @ApiInternalServerErrorResponse({
        description: '내부 서버 오류',
    })
    async deleteComment(
        @Param('commentId', ParseUUIDPipe) commentId: string,
        @User('id') userId: string,
    ): Promise<void> {
        return this.commentService.deleteComment(commentId, userId);
    }
}
