import { Module } from '@nestjs/common';
import { DomainCommentModule } from '@src/domain/comment/comment.module';
import { DomainTaskModule } from '@src/domain/task/task.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { DomainUserModule } from '@src/domain/user/user.module';
import { DomainActivityLogModule } from '@src/domain/activity-log/activity-log.module';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentUseCase, GetTaskCommentsUseCase, UpdateCommentUseCase, DeleteCommentUseCase } from './usecases';

@Module({
    imports: [
        DomainCommentModule,
        DomainTaskModule,
        DomainProjectMemberModule,
        DomainUserModule,
        DomainActivityLogModule,
    ],
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
