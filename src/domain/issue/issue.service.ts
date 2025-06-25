import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { Issue } from '../entities/issue.entity';
import { DomainIssueRepository, IssueFilterOptions } from './issue.repository';
import { IssueType } from '@src/common/enums/issue-type.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainIssueService extends BaseService<Issue> {
    constructor(private readonly issueRepository: DomainIssueRepository) {
        super(issueRepository);
    }

    async getIssuesWithFilters(
        filters: IssueFilterOptions,
        options?: IRepositoryOptions<Issue>,
    ): Promise<{ data: Issue[]; total: number; page: number; limit: number; totalPages: number }> {
        const [issues, total] = await this.issueRepository.findWithFilters(filters, options);
        const page = filters.page || 1;
        const limit = filters.limit || 20;

        return {
            data: issues,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getIssueWithRelations(id: string, options?: IRepositoryOptions<Issue>): Promise<Issue | null> {
        return this.issueRepository.findByIdWithRelations(id, options);
    }

    async createIssue(
        title: string,
        projectId: string,
        authorId: string,
        options?: {
            description?: string;
            type?: IssueType;
            repositoryOptions?: IRepositoryOptions<Issue>;
        },
    ): Promise<Issue> {
        const issueData = {
            title,
            projectId,
            authorId,
            description: options?.description,
            type: options?.type || IssueType.BUG,
        };

        return this.save(issueData, options?.repositoryOptions);
    }
}
