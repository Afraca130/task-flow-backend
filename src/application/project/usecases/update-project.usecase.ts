import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { plainToInstance } from 'class-transformer';
import { DateUtil } from '@src/common/utils/date.util';
import { UpdateProjectDto, ProjectResponseDto } from '@src/application/project/dtos';

@Injectable()
export class UpdateProjectUseCase {
    constructor(private readonly projectService: DomainProjectService) {}

    async execute(projectId: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<ProjectResponseDto> {
        const { name, description, isPublic, startDate, endDate, approvalType } = updateProjectDto;

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
            // 날짜 유효성 검사
            const newStartDate = startDate || project.startDate;
            const newEndDate = endDate || project.endDate;

            if (newStartDate && newEndDate && newStartDate > newEndDate) {
                throw new ConflictException('시작일은 종료일보다 늦을 수 없습니다.');
            }

            if (description !== undefined) project.description = description;
            if (isPublic !== undefined) project.isPublic = isPublic;
            if (startDate !== undefined) project.startDate = DateUtil.date(startDate).toDate();
            if (endDate !== undefined) project.endDate = DateUtil.date(endDate).toDate();
            if (approvalType !== undefined) project.approvalType = approvalType;

            await this.projectService.updateProject(project);

            return plainToInstance(ProjectResponseDto, project);
        } catch (error) {
            throw new BadRequestException('프로젝트 수정에 실패했습니다.', { cause: error });
        }
    }
}
