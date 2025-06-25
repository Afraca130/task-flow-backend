import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { ProjectMember } from '../entities/project-member.entity';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainProjectMemberRepository extends BaseRepository<ProjectMember> {
    constructor(
        @InjectRepository(ProjectMember)
        private readonly projectMemberRepository: Repository<ProjectMember>,
    ) {
        super(projectMemberRepository);
    }

    async countByProjectId(projectId: string, options?: IRepositoryOptions<ProjectMember>): Promise<number> {
        const repository = options?.queryRunner
            ? options.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        return repository.count({
            where: { projectId, isActive: true },
            ...options,
        });
    }
}
