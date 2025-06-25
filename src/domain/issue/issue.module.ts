import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from '../entities/issue.entity';
import { DomainIssueRepository } from './issue.repository';
import { DomainIssueService } from './issue.service';

@Module({
    imports: [TypeOrmModule.forFeature([Issue])],
    providers: [DomainIssueRepository, DomainIssueService],
    exports: [DomainIssueRepository, DomainIssueService],
})
export class DomainIssueModule {}
