import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class GetTasksByProjectUseCase {
    private readonly logger = new Logger(GetTasksByProjectUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectService: DomainProjectService,
        private readonly projectMemberService: DomainProjectMemberService,
    ) {}

    async execute(projectId: string, userId: string): Promise<TaskResponseDto[]> {
        this.logger.log(`Getting tasks for project: ${projectId} by user: ${userId}`);

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

        const tasks = await this.taskService.getTasksByProject(projectId);

        this.logger.log(`Found ${tasks.length} tasks for project: ${projectId}`);

        return tasks.map((task) =>
            plainToInstance(TaskResponseDto, task, {
                excludeExtraneousValues: true,
            }),
        );
    }
}
