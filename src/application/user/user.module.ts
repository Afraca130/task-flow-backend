import { DomainUserModule } from '@src/domain/user/user.module';
import { DomainProjectModule } from '@src/domain/project/project.module';
import { DomainProjectMemberModule } from '@src/domain/project-member/project-member.module';
import { Module } from '@nestjs/common';
// import { UserController } from './controllers/user.controller.ts.ds';
import { UserService } from './user.service';
import { GetUserProjectsUseCase, GetUsersUseCase, SearchUsersUseCase, UpdateUserUseCase } from './usecases';
import { UserController } from './controllers/user.controller';

@Module({
    imports: [DomainUserModule, DomainProjectModule, DomainProjectMemberModule],
    controllers: [UserController],
    providers: [UserService, GetUserProjectsUseCase, GetUsersUseCase, SearchUsersUseCase, UpdateUserUseCase],
    exports: [UserService],
})
export class UserModule {}
