import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainCommentService } from '@src/domain/comment/comment.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { UpdateCommentDto } from '../dtos/update-comment.dto';
import { CommentResponseDto } from '../dtos/comment-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class UpdateCommentUseCase {
    private readonly logger = new Logger(UpdateCommentUseCase.name);

    constructor(
        private readonly commentService: DomainCommentService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(commentId: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<CommentResponseDto> {
        this.logger.log(`Updating comment: ${commentId} by user: ${userId}`);

        // 댓글 존재 확인
        const comment = await this.commentService.getCommentWithRelations(commentId);

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }

        // 댓글 작성자 권한 확인 (본인만 수정 가능)
        if (comment.userId !== userId) {
            // 관리자나 매니저인 경우 예외적으로 허용할 수도 있음
            const isManager = await this.projectMemberService.hasPermission(
                comment.task.projectId,
                userId,
                ProjectMemberRole.MANAGER,
            );

            if (!isManager) {
                throw new ForbiddenException('댓글을 수정할 권한이 없습니다.');
            }
        }

        // 댓글 업데이트
        const updatedComment = await this.commentService.updateComment(commentId, updateCommentDto.content);

        // 관계 정보와 함께 댓글 조회
        const commentWithRelations = await this.commentService.getCommentWithRelations(updatedComment.id);

        if (!commentWithRelations) {
            throw new Error('업데이트된 댓글을 조회할 수 없습니다.');
        }

        this.logger.log(`Comment updated successfully: ${commentId}`);

        return plainToInstance(CommentResponseDto, commentWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
