import { BaseRepository } from '@src/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainProjectRepository extends BaseRepository<Project> {
    constructor(
        @InjectRepository(Project)
        repository: Repository<Project>,
    ) {
        super(repository);
    }

    async findAndCount(options: IRepositoryOptions<Project>): Promise<[Project[], number]> {
        return this.repository.findAndCount(options);
    }

    async softDelete(id: string): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
