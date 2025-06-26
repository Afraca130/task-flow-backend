import { Injectable } from '@nestjs/common';
import { GetUserProjectsUseCase } from './usecase/get-user-projects.usecase';
import { GetUsersUseCase, SearchUsersUseCase, UpdateUserUseCase } from './usecases';
import { SearchUsersQueryDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
    constructor(
        private readonly getUserProjectsUseCase: GetUserProjectsUseCase,
        private readonly getUsersUseCase: GetUsersUseCase,
        private readonly searchUsersUseCase: SearchUsersUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
    ) {}

    async getUserProjects(userId: string) {
        return this.getUserProjectsUseCase.execute(userId);
    }

    async getUsers() {
        return this.getUsersUseCase.execute();
    }

    async searchUsers(query: SearchUsersQueryDto) {
        return this.searchUsersUseCase.execute(query);
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto, requestUserId: string) {
        return this.updateUserUseCase.execute(userId, updateUserDto, requestUserId);
    }
}
