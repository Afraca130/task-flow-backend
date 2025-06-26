import { BaseService } from '@src/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { DomainProjectRepository } from './project.repository';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';
import { DeleteResult } from 'typeorm';
import { ProjectPriority } from '@src/common/enums/project-priority.enum';

@Injectable()
export class DomainProjectService extends BaseService<Project> {
    constructor(private readonly projectRepository: DomainProjectRepository) {
        super(projectRepository);
    }

    async createProject(project: Project): Promise<Project> {
        return this.projectRepository.save(project);
    }

    async getProjects(options: IRepositoryOptions<Project>): Promise<[Project[], number]> {
        return this.projectRepository.findAndCount(options);
    }

    async getProjectByNameWithOwnerId(name: string, ownerId: string): Promise<Project> {
        return this.projectRepository.findOne({ where: { name, ownerId } });
    }

    async getProjectWithCounts(id: string): Promise<Project> {
        return this.projectRepository.findOne({
            where: { id },
            relations: ['owner', 'members'],
        });
    }

    async getProjectsWithCounts(options: IRepositoryOptions<Project>): Promise<[Project[], number]> {
        return this.projectRepository.findAndCount({
            ...options,
            relations: ['owner', 'members'],
        });
    }

    async updateProject(project: Project): Promise<void> {
        await this.projectRepository.update(project.id, project);
    }

    async deleteProject(id: string): Promise<DeleteResult> {
        return this.projectRepository.softDelete(id);
    }

    async getActiveProjects(ownerId?: string): Promise<Project[]> {
        const whereCondition: any = { isActive: true };
        if (ownerId) {
            whereCondition.ownerId = ownerId;
        }

        return this.projectRepository.findAll({
            where: whereCondition,
            relations: ['owner', 'members'],
        });
    }

    async getProjectsByPriority(priority: ProjectPriority): Promise<Project[]> {
        return this.projectRepository.findAll({
            where: { priority },
            relations: ['owner', 'members'],
        });
    }

    async getProjectsWithDueDateBefore(date: Date): Promise<Project[]> {
        // Note: This is a simplified implementation
        // For complex queries with date comparisons, you might need to implement this in the repository
        const projects = await this.projectRepository.findAll({
            where: { isActive: true },
            relations: ['owner', 'members'],
        });

        return projects.filter((project) => project.dueDate && new Date(project.dueDate) <= date);
    }

    // async getProjectsByOwnerId(ownerId: string): Promise<Project[]> {
    //     return this.projectRepository.findAll({ where: { ownerId } });
    // }

    // async getProjectByInviteCode(inviteCode: string): Promise<Project | null> {
    //     return this.projectRepository.findOne({ where: { inviteCode } });
    // }

    // async getProjectsByStatus(status: ProjectStatus): Promise<Project[]> {
    //     return this.projectRepository.findAll({ where: { status } });
    // }

    // async regenerateInviteCode(id: string, userId?: string): Promise<string> {
    //     const project = await this.findOne({ where: { id } as any });
    //     if (!project) {
    //         throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    //     }

    //     // 소유자 권한 체크
    //     if (userId && project.ownerId !== userId) {
    //         throw new ForbiddenException('초대 코드를 재생성할 권한이 없습니다.');
    //     }

    //     const newInviteCode = this.generateInviteCode();
    //     project.inviteCode = newInviteCode;

    //     await this.projectRepository.save(project);
    //     return newInviteCode;
    // }
}
