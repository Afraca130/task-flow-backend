import { BaseService } from '@src/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { DomainProjectRepository } from './project.repository';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';
import { DeleteResult } from 'typeorm';

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

    async updateProject(project: Project): Promise<void> {
        await this.projectRepository.update(project.id, project);
    }

    async deleteProject(id: string): Promise<DeleteResult> {
        return this.projectRepository.softDelete(id);
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
