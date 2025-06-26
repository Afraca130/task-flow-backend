import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { plainToInstance } from 'class-transformer';
import { UpdateProjectDto, ProjectResponseDto } from '@src/application/project/dtos';

@Injectable()
export class UpdateProjectUseCase {
    constructor(private readonly projectService: DomainProjectService) {}

    async execute(projectId: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<ProjectResponseDto> {
        const { name, description, color, priority, dueDate, isActive, isPublic } = updateProjectDto;

        const project = await this.projectService.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 소유자 권한 체크
        if (userId && project.ownerId !== userId) {
            throw new ForbiddenException('프로젝트를 수정할 권한이 없습니다.');
        }

        // 프로젝트명 변경 시 중복 체크
        if (name && name !== project.name) {
            const existProject = await this.projectService.getProjectByNameWithOwnerId(name, project.ownerId);
            if (existProject) {
                throw new ConflictException('소유자 프로젝트 중 프로젝트명이 이미 존재합니다.');
            }
            project.name = name;
        }

        try {
            // 마감일 유효성 검사
            if (dueDate && new Date(dueDate) <= new Date()) {
                throw new BadRequestException('마감일은 현재 시간보다 미래여야 합니다.');
            }

            if (description !== undefined) project.description = description;
            if (color !== undefined) project.color = color;
            if (priority !== undefined) project.priority = priority;
            if (dueDate !== undefined) project.dueDate = dueDate ? new Date(dueDate) : null;
            if (isActive !== undefined) project.isActive = isActive;
            if (isPublic !== undefined) project.isPublic = isPublic;

            await this.projectService.updateProject(project);

            // 업데이트된 프로젝트에 관계 데이터 추가
            const projectWithCounts = await this.projectService.getProjectWithCounts(project.id);
            const response = plainToInstance(ProjectResponseDto, projectWithCounts);

            // memberCount 계산
            response.memberCount = projectWithCounts.members?.length || 0;

            // taskCount는 별도 서비스를 통해 계산 (circular dependency 해결)
            response.taskCount = 0; // 임시로 0 설정

            return response;
        } catch (error) {
            throw new BadRequestException('프로젝트 수정에 실패했습니다.', { cause: error });
        }
    }
}
