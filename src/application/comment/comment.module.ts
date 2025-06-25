import { Module } from '@nestjs/common';
import { DomainCommentModule } from '@src/domain/comment/comment.module';
import { TaskModule } from '@src/domain/task/task.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentUseCase, GetTaskCommentsUseCase, UpdateCommentUseCase, DeleteCommentUseCase } from './usecases';

@Module({
    imports: [DomainCommentModule, TaskModule, DomainProjectMemberModule],
    controllers: [CommentController],
    providers: [
        CommentService,
        CreateCommentUseCase,
        GetTaskCommentsUseCase,
        UpdateCommentUseCase,
        DeleteCommentUseCase,
    ],
    exports: [CommentService],
})
export class CommentModule {}
