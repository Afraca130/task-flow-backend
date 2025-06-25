import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainCommentService } from '@src/domain/comment/comment.service';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { CommentResponseDto } from '../dtos/comment-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class GetTaskCommentsUseCase {
    private readonly logger = new Logger(GetTaskCommentsUseCase.name);

    constructor(
        private readonly commentService: DomainCommentService,
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(taskId: string, userId: string): Promise<CommentResponseDto[]> {
        this.logger.log(`Getting comments for task: ${taskId} by user: ${userId}`);

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
            throw new ForbiddenException('해당 태스크의 댓글을 조회할 권한이 없습니다.');
        }

        // 댓글 조회 (대댓글 포함)
        const comments = await this.commentService.getCommentsByTaskId(taskId);

        this.logger.log(`Found ${comments.length} comments for task: ${taskId}`);

        return comments.map((comment) =>
            plainToInstance(CommentResponseDto, comment, {
                excludeExtraneousValues: true,
            }),
        );
    }
}
