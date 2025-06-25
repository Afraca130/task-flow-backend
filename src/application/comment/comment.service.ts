import { Injectable } from '@nestjs/common';
import { CreateCommentUseCase, GetTaskCommentsUseCase, UpdateCommentUseCase, DeleteCommentUseCase } from './usecases';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from './dtos';

@Injectable()
export class CommentService {
    constructor(
        private readonly createCommentUseCase: CreateCommentUseCase,
        private readonly getTaskCommentsUseCase: GetTaskCommentsUseCase,
        private readonly updateCommentUseCase: UpdateCommentUseCase,
        private readonly deleteCommentUseCase: DeleteCommentUseCase,
    ) {}

    async createComment(createCommentDto: CreateCommentDto, userId: string): Promise<CommentResponseDto> {
        return this.createCommentUseCase.execute(createCommentDto, userId);
    }

    async getTaskComments(taskId: string, userId: string): Promise<CommentResponseDto[]> {
        return this.getTaskCommentsUseCase.execute(taskId, userId);
    }

    async updateComment(
        commentId: string,
        updateCommentDto: UpdateCommentDto,
        userId: string,
    ): Promise<CommentResponseDto> {
        return this.updateCommentUseCase.execute(commentId, updateCommentDto, userId);
    }

    async deleteComment(commentId: string, userId: string): Promise<void> {
        return this.deleteCommentUseCase.execute(commentId, userId);
    }
}
