import { Injectable } from '@nestjs/common';
import { DomainUserService } from '@/domain/user/user.service';
import { SearchUsersQueryDto } from '../dtos/search-users-query.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { PaginationData } from '@/common/dtos';
import { Like } from 'typeorm';

@Injectable()
export class SearchUsersUseCase {
    constructor(private readonly domainUserService: DomainUserService) {}

    async execute(query: SearchUsersQueryDto): Promise<PaginationData<UserResponseDto>> {
        const { search, isActive, page = 1, limit = 10 } = query;

        // 검색 조건 구성
        const where: any = {};

        if (search) {
            where.name = Like(`%${search}%`);
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        // 페이지네이션 계산
        const skip = (page - 1) * limit;

        // 사용자 검색을 위해 findAll 사용 (findAndCount 메서드가 없으므로)
        const users = await this.domainUserService.findAll({
            where,
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });

        // 전체 개수는 별도 쿼리로 조회
        const allUsers = await this.domainUserService.findAll({ where });
        const total = allUsers.length;

        // Response DTO로 변환
        const data = users.map(
            (user) =>
                new UserResponseDto({
                    ...user,
                    createdAt: user.createdAt?.toISOString(),
                    updatedAt: user.updatedAt?.toISOString(),
                    lastLoginAt: user.lastLoginAt?.toISOString(),
                }),
        );

        const totalPages = Math.ceil(total / limit);

        const paginationData = new PaginationData<UserResponseDto>();
        paginationData.data = data;
        paginationData.meta = {
            total,
            page,
            limit,
            totalPages,
        };

        return paginationData;
    }
}
