import { Injectable } from '@nestjs/common';
import { DomainUserService } from '@/domain/user/user.service';
import { UserResponseDto } from '../dtos/user-response.dto';
import { PaginationData } from '@/common/dtos';

@Injectable()
export class GetUsersUseCase {
    constructor(private readonly domainUserService: DomainUserService) {}

    async execute(): Promise<PaginationData<UserResponseDto>> {
        const users = await this.domainUserService.findAll({
            order: {
                createdAt: 'DESC',
            },
        });

        const data = users.map(
            (user) =>
                new UserResponseDto({
                    ...user,
                    createdAt: user.createdAt?.toISOString(),
                    updatedAt: user.updatedAt?.toISOString(),
                    lastLoginAt: user.lastLoginAt?.toISOString(),
                }),
        );

        const paginationData = new PaginationData<UserResponseDto>();
        paginationData.data = data;
        paginationData.meta = {
            total: data.length,
            page: 1,
            limit: data.length,
            totalPages: 1,
        };

        return paginationData;
    }
}
