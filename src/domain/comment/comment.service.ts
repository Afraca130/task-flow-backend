import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { Comment } from '../entities/comment.entity';
import { DomainCommentRepository } from './comment.repository';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainCommentService extends BaseService<Comment> {
    constructor(private readonly commentRepository: DomainCommentRepository) {
        super(commentRepository);
    }

    async createComment(
        content: string,
        taskId: string,
        userId: string,
        parentId?: string,
        options?: IRepositoryOptions<Comment>,
    ): Promise<Comment> {
        const commentData = {
            content,
            taskId,
            userId,
            parentId,
            isDeleted: false,
        };

        return this.save(commentData, options);
    }

    async getCommentsByTaskId(taskId: string, options?: IRepositoryOptions<Comment>): Promise<Comment[]> {
        return this.commentRepository.findByTaskIdFlat(taskId, options);
    }

    async getCommentsByTaskIdWithReplies(taskId: string, options?: IRepositoryOptions<Comment>): Promise<Comment[]> {
        return this.commentRepository.findByTaskIdWithReplies(taskId, options);
    }

    async getCommentWithRelations(commentId: string, options?: IRepositoryOptions<Comment>): Promise<Comment | null> {
        return this.commentRepository.findByIdWithRelations(commentId, options);
    }

    async updateComment(commentId: string, content: string, options?: IRepositoryOptions<Comment>) {
        return this.update(commentId, { content }, options);
    }

    async deleteComment(commentId: string, options?: IRepositoryOptions<Comment>): Promise<void> {
        await this.commentRepository.softDelete(commentId, options);
    }

    async countCommentsByTaskId(taskId: string, options?: IRepositoryOptions<Comment>): Promise<number> {
        return this.commentRepository.countByTaskId(taskId, options);
    }

    async getRepliesByParentId(parentId: string, options?: IRepositoryOptions<Comment>): Promise<Comment[]> {
        return this.commentRepository.findRepliesByParentId(parentId, options);
    }

    async isCommentOwner(commentId: string, userId: string, options?: IRepositoryOptions<Comment>): Promise<boolean> {
        const comment = await this.findOne({
            where: { id: commentId, isDeleted: false },
            ...options,
        });

        return comment?.userId === userId;
    }

    async getCommentTaskId(commentId: string, options?: IRepositoryOptions<Comment>): Promise<string | null> {
        const comment = await this.findOne({
            where: { id: commentId, isDeleted: false },
            select: { taskId: true },
            ...options,
        });

        return comment?.taskId || null;
    }
}
