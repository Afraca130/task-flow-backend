import { Module } from '@nestjs/common';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { DomainProjectModule } from '@src/domain/project/project.module';
import { ProjectMemberController } from './controllers/project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { GetProjectMembersUseCase } from './usecases/get-project-members.usecase';
import { UpdateMemberRoleUseCase } from './usecases/update-member-role.usecase';
import { RemoveProjectMemberUseCase } from './usecases/remove-project-member.usecase';

@Module({
    imports: [DomainProjectMemberModule, DomainProjectModule],
    controllers: [ProjectMemberController],
    providers: [ProjectMemberService, GetProjectMembersUseCase, UpdateMemberRoleUseCase, RemoveProjectMemberUseCase],
    exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
