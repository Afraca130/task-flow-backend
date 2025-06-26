import { Module } from '@nestjs/common';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { DomainProjectModule } from '@src/domain/project/project.module';
import { DomainUserModule } from '@src/domain/user/user.module';
import { DomainActivityLogModule } from '@src/domain/activity-log/activity-log.module';
import { ProjectMemberController } from './controllers/project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { GetProjectMembersUseCase } from './usecases/get-project-members.usecase';
import { UpdateMemberRoleUseCase } from './usecases/update-member-role.usecase';
import { RemoveProjectMemberUseCase } from './usecases/remove-project-member.usecase';

@Module({
    imports: [DomainProjectMemberModule, DomainProjectModule, DomainUserModule, DomainActivityLogModule],
    controllers: [ProjectMemberController],
    providers: [ProjectMemberService, GetProjectMembersUseCase, UpdateMemberRoleUseCase, RemoveProjectMemberUseCase],
    exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
