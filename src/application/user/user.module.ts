import { DomainUserModule } from '@/domain/user/user.module';
import { DomainProjectModule } from '@/domain/project/project.module';
import { DomainProjectMemberModule } from '@/domain/project-member/project-member.module';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { GetUserProjectsUseCase } from './usecase/get-user-projects.usecase';
import { GetUsersUseCase, SearchUsersUseCase, UpdateUserUseCase } from './usecases';

@Module({
    imports: [DomainUserModule, DomainProjectModule, DomainProjectMemberModule],
    controllers: [UserController],
    providers: [UserService, GetUserProjectsUseCase, GetUsersUseCase, SearchUsersUseCase, UpdateUserUseCase],
    exports: [UserService],
})
export class UserModule {}
