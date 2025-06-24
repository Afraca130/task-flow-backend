import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { DomainProjectRepository } from './project.repository';
import { DomainProjectService } from './project.service';

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    providers: [DomainProjectRepository, DomainProjectService],
    exports: [DomainProjectService],
})
export class DomainProjectModule {}
