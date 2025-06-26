import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { Comment } from '../entities/comment.entity';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainCommentRepository extends BaseRepository<Comment> {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {
        super(commentRepository);
    }

    async findByTaskId(taskId: string, options?: IRepositoryOptions<Comment>): Promise<Comment[]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.find({
            where: { taskId, isDeleted: false },
            relations: ['user', 'replies', 'replies.user'],
            order: {
                createdAt: 'ASC',
                replies: { createdAt: 'ASC' },
            },
            ...options,
        });
    }

    async findByTaskIdFlat(taskId: string, options?: IRepositoryOptions<Comment>): Promise<Comment[]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        // 모든 댓글을 플랫하게 조회 (대댓글 구조 없이)
        return repository.find({
            where: {
                taskId,
                isDeleted: false,
            },
            relations: ['user'],
            order: {
                createdAt: 'ASC',
            },
            ...options,
        });
    }

    async findByTaskIdWithReplies(taskId: string, options?: IRepositoryOptions<Comment>): Promise<Comment[]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        // 부모 댓글만 조회 (대댓글은 relations로)
        return repository.find({
            where: {
                taskId,
                isDeleted: false,
                parentId: null, // 부모 댓글만
            },
            relations: ['user', 'replies', 'replies.user'],
            order: {
                createdAt: 'ASC',
                replies: { createdAt: 'ASC' },
            },
            ...options,
        });
    }

    async findByIdWithRelations(id: string, options?: IRepositoryOptions<Comment>): Promise<Comment | null> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.findOne({
            where: { id, isDeleted: false },
            relations: ['user', 'task', 'parent', 'replies'],
            ...options,
        });
    }

    async countByTaskId(taskId: string, options?: IRepositoryOptions<Comment>): Promise<number> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.count({
            where: { taskId, isDeleted: false },
        });
    }

    async softDelete(id: string, options?: IRepositoryOptions<Comment>): Promise<void> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        await repository.update(id, { isDeleted: true });
    }

    async findRepliesByParentId(parentId: string, options?: IRepositoryOptions<Comment>): Promise<Comment[]> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.find({
            where: { parentId, isDeleted: false },
            relations: ['user'],
            order: { createdAt: 'ASC' },
            ...options,
        });
    }
}
