import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { TaskStatus } from '@src/common/enums/task-status.enum';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class GetTasksByProjectAndStatusUseCase {
    private readonly logger = new Logger(GetTasksByProjectAndStatusUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectService: DomainProjectService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(
        projectId: string,
        status: TaskStatus,
        page: number = 1,
        limit: number = 20,
        userId: string,
    ): Promise<{ data: TaskResponseDto[]; meta: any }> {
        this.logger.log(`Getting tasks for project: ${projectId}, status: ${status}, page: ${page} by user: ${userId}`);

        // 프로젝트 존재 확인
        const project = await this.projectService.findOne({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인
        const hasPermission = await this.projectMemberService.hasPermission(
            projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('해당 프로젝트의 태스크를 조회할 권한이 없습니다.');
        }

        const result = await this.taskService.getTasksByProjectAndStatus(projectId, status, page, limit);

        const taskDtos = result.data.map((task) =>
            plainToInstance(TaskResponseDto, task, {
                excludeExtraneousValues: true,
            }),
        );

        this.logger.log(`Found ${taskDtos.length} tasks for project: ${projectId}, status: ${status}`);

        return {
            data: taskDtos,
            meta: result.meta,
        };
    }
}
