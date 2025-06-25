import { Module } from '@nestjs/common';
import { InvitationModule as DomainInvitationModule } from '@src/domain/invitation/invitation.module';
import { DomainProjectModule } from '@src/domain/project/project.module';
import { DomainUserModule } from '@src/domain/user/user.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';

// Controllers
import { InvitationController } from './controllers/invitation.controller';

// Services
import { InvitationService } from './invitation.service';

// Use Cases
import {
    CreateInvitationUseCase,
    AcceptInvitationUseCase,
    DeclineInvitationUseCase,
    GetInvitationUseCase,
    GetProjectInvitationsUseCase,
    GetUserInvitationsUseCase,
    DeleteInvitationUseCase,
} from './usecases/index';

@Module({
    imports: [DomainInvitationModule, DomainProjectModule, DomainUserModule, DomainProjectMemberModule],
    controllers: [InvitationController],
    providers: [
        InvitationService,
        // Use Cases
        CreateInvitationUseCase,
        AcceptInvitationUseCase,
        DeclineInvitationUseCase,
        GetInvitationUseCase,
        GetProjectInvitationsUseCase,
        GetUserInvitationsUseCase,
        DeleteInvitationUseCase,
    ],
    exports: [InvitationService],
})
export class InvitationModule {}
