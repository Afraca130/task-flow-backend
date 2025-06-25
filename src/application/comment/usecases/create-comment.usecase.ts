import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainCommentService } from '@src/domain/comment/comment.service';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentResponseDto } from '../dtos/comment-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class CreateCommentUseCase {
    private readonly logger = new Logger(CreateCommentUseCase.name);

    constructor(
        private readonly commentService: DomainCommentService,
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(createCommentDto: CreateCommentDto, userId: string): Promise<CommentResponseDto> {
        const { content, taskId, parentId } = createCommentDto;

        this.logger.log(`Creating comment for task: ${taskId} by user: ${userId}`);

        // 태스크 존재 확인
        const task = await this.taskService.findOne({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundException('태스크를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인
        const hasPermission = await this.projectMemberService.hasPermission(
            task.projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('해당 태스크에 댓글을 작성할 권한이 없습니다.');
        }

        // 부모 댓글 검증 (대댓글인 경우)
        if (parentId) {
            const parentComment = await this.commentService.findOne({
                where: { id: parentId, isDeleted: false },
            });

            if (!parentComment) {
                throw new NotFoundException('부모 댓글을 찾을 수 없습니다.');
            }

            if (parentComment.taskId !== taskId) {
                throw new BadRequestException('부모 댓글과 태스크가 일치하지 않습니다.');
            }

            // 대댓글의 대댓글은 허용하지 않음
            if (parentComment.parentId) {
                throw new BadRequestException('대댓글에는 답글을 작성할 수 없습니다.');
            }
        }

        // 댓글 생성
        const comment = await this.commentService.createComment(content, taskId, userId, parentId);

        // 관계 정보와 함께 댓글 조회
        const commentWithRelations = await this.commentService.getCommentWithRelations(comment.id);

        if (!commentWithRelations) {
            throw new Error('생성된 댓글을 조회할 수 없습니다.');
        }

        this.logger.log(`Comment created successfully: ${comment.id}`);

        return plainToInstance(CommentResponseDto, commentWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
