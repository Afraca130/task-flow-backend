import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainCommentService } from '@src/domain/comment/comment.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class DeleteCommentUseCase {
    private readonly logger = new Logger(DeleteCommentUseCase.name);

    constructor(
        private readonly commentService: DomainCommentService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(commentId: string, userId: string): Promise<void> {
        this.logger.log(`Deleting comment: ${commentId} by user: ${userId}`);

        // 댓글 존재 확인
        const comment = await this.commentService.getCommentWithRelations(commentId);

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }

        // 댓글 작성자 권한 확인 (본인만 삭제 가능)
        if (comment.userId !== userId) {
            // 관리자나 매니저인 경우 예외적으로 허용
            const isManager = await this.projectMemberService.hasPermission(
                comment.task.projectId,
                userId,
                ProjectMemberRole.MANAGER,
            );

            if (!isManager) {
                throw new ForbiddenException('댓글을 삭제할 권한이 없습니다.');
            }
        }

        // 댓글 소프트 삭제
        await this.commentService.deleteComment(commentId);

        this.logger.log(`Comment deleted successfully: ${commentId}`);
    }
}
