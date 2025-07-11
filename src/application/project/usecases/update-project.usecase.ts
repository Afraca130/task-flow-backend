import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainActivityLogService } from '@src/domain/activity-log/activity-log.service';
import { plainToInstance } from 'class-transformer';
import { UpdateProjectDto, ProjectResponseDto } from '@src/application/project/dtos';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';

@Injectable()
export class UpdateProjectUseCase {
    private readonly logger = new Logger(UpdateProjectUseCase.name);

    constructor(
        private readonly projectService: DomainProjectService,
        private readonly activityLogService: DomainActivityLogService,
    ) {}

    async execute(projectId: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<ProjectResponseDto> {
        this.logger.log(`Updating project: ${projectId} by user: ${userId}`);

        const { name, description, color, priority, dueDate, isActive, isPublic } = updateProjectDto;

        const project = await this.projectService.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 소유자 권한 체크
        if (userId && project.ownerId !== userId) {
            throw new ForbiddenException('프로젝트를 수정할 권한이 없습니다.');
        }

        // 변경사항 추적
        const changes: string[] = [];
        const metadata: Record<string, any> = {};

        // 프로젝트명 변경 시 중복 체크
        if (name && name !== project.name) {
            const existProject = await this.projectService.getProjectByNameWithOwnerId(name, project.ownerId);
            if (existProject) {
                throw new ConflictException('소유자 프로젝트 중 프로젝트명이 이미 존재합니다.');
            }
            changes.push(`이름: "${project.name}" → "${name}"`);
            metadata.oldName = project.name;
            metadata.newName = name;
            project.name = name;
        }

        try {
            // 마감일 유효성 검사
            if (dueDate && new Date(dueDate) <= new Date()) {
                throw new BadRequestException('마감일은 현재 시간보다 미래여야 합니다.');
            }

            if (description !== undefined && description !== project.description) {
                changes.push('설명 변경');
                metadata.oldDescription = project.description;
                metadata.newDescription = description;
                project.description = description;
            }

            if (color !== undefined && color !== project.color) {
                changes.push(`색상: ${project.color} → ${color}`);
                metadata.oldColor = project.color;
                metadata.newColor = color;
                project.color = color;
            }

            if (priority !== undefined && priority !== project.priority) {
                changes.push(`우선순위: ${project.priority} → ${priority}`);
                metadata.oldPriority = project.priority;
                metadata.newPriority = priority;
                project.priority = priority;
            }

            if (dueDate !== undefined) {
                const newDueDate = dueDate ? new Date(dueDate) : null;
                if (newDueDate?.getTime() !== project.dueDate?.getTime()) {
                    changes.push('마감일 변경');
                    metadata.oldDueDate = project.dueDate;
                    metadata.newDueDate = newDueDate;
                    project.dueDate = newDueDate;
                }
            }

            if (isActive !== undefined && isActive !== project.isActive) {
                changes.push(`활성 상태: ${project.isActive} → ${isActive}`);
                metadata.oldIsActive = project.isActive;
                metadata.newIsActive = isActive;
                project.isActive = isActive;
            }

            if (isPublic !== undefined && isPublic !== project.isPublic) {
                changes.push(`공개 상태: ${project.isPublic} → ${isPublic}`);
                metadata.oldIsPublic = project.isPublic;
                metadata.newIsPublic = isPublic;
                project.isPublic = isPublic;
            }

            await this.projectService.updateProject(project);

            // Activity Log 기록 (변경사항이 있는 경우만)
            if (changes.length > 0) {
                try {
                    const description = `"${project.name}" 프로젝트를 수정했습니다: ${changes.join(', ')}`;
                    await this.activityLogService.logActivity(
                        userId,
                        projectId,
                        projectId,
                        ActivityEntityType.PROJECT,
                        'UPDATED',
                        description,
                        metadata,
                    );
                } catch (error) {
                    this.logger.error('Failed to log project update activity', error);
                }
            }

            // 업데이트된 프로젝트에 관계 데이터 추가
            const projectWithCounts = await this.projectService.getProjectWithCounts(project.id);
            const response = plainToInstance(ProjectResponseDto, projectWithCounts);

            // memberCount 계산
            response.memberCount = projectWithCounts.members?.length || 0;

            // taskCount는 별도 서비스를 통해 계산 (circular dependency 해결)
            response.taskCount = 0; // 임시로 0 설정

            this.logger.log(`Project updated successfully: ${projectId}`);

            return response;
        } catch (error) {
            this.logger.error('Failed to update project', error);
            throw new BadRequestException('프로젝트 수정에 실패했습니다.', { cause: error });
        }
    }
}
