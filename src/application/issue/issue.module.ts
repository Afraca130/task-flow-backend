import { Module } from '@nestjs/common';
import { DomainIssueModule } from '@src/domain/issue/issue.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { NotificationModule } from '@src/domain/notification/notification.module';
import { IssueController } from './controllers/issue.controller';
import { IssueService } from './issue.service';
import * as UseCases from './usecases';

@Module({
    imports: [DomainIssueModule, DomainProjectMemberModule, NotificationModule],
    controllers: [IssueController],
    providers: [
        IssueService,
        // UseCases
        UseCases.GetIssuesUseCase,
        UseCases.GetIssueUseCase,
        UseCases.CreateIssueUseCase,
        UseCases.CreateIssueWithMentionsUseCase,
        UseCases.UpdateIssueUseCase,
        UseCases.DeleteIssueUseCase,
    ],
    exports: [
        IssueService,
        // UseCases는 필요에 따라 다른 모듈에서 사용할 수 있도록 export
        UseCases.GetIssuesUseCase,
        UseCases.GetIssueUseCase,
        UseCases.CreateIssueUseCase,
        UseCases.CreateIssueWithMentionsUseCase,
        UseCases.UpdateIssueUseCase,
        UseCases.DeleteIssueUseCase,
    ],
})
export class IssueModule {}
