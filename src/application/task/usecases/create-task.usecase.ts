import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class CreateTaskUseCase {
    private readonly logger = new Logger(CreateTaskUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectService: DomainProjectService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
    ) {}

    async execute(createTaskDto: CreateTaskDto, userId: string): Promise<TaskResponseDto> {
        const { title, description, priority, status, assigneeId, projectId, dueDate, tags } = createTaskDto;

        this.logger.log(`Creating task "${title}" in project: ${projectId} by user: ${userId}`);

        // 프로젝트 존재 확인
        const project = await this.projectService.findOne({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인 (멤버 이상)
        const hasPermission = await this.projectMemberService.hasPermission(
            projectId,
            userId,
            ProjectMemberRole.MEMBER,
        );

        if (!hasPermission) {
            throw new ForbiddenException('해당 프로젝트에서 태스크를 생성할 권한이 없습니다.');
        }

        // 담당자 검증 (담당자가 지정된 경우)
        if (assigneeId) {
            const assignee = await this.userService.findOne({
                where: { id: assigneeId },
            });

            if (!assignee) {
                throw new NotFoundException('지정된 담당자를 찾을 수 없습니다.');
            }

            // 담당자가 프로젝트 멤버인지 확인
            const assigneeIsMember = await this.projectMemberService.hasPermission(
                projectId,
                assigneeId,
                ProjectMemberRole.MEMBER,
            );

            if (!assigneeIsMember) {
                throw new ForbiddenException('담당자가 해당 프로젝트의 멤버가 아닙니다.');
            }
        }

        // 태스크 생성
        const task = await this.taskService.createTask(title, projectId, userId, {
            description,
            priority,
            status,
            assigneeId,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            tags,
        });

        // 관계 정보와 함께 태스크 조회
        const taskWithRelations = await this.taskService.getTaskWithRelations(task.id);

        if (!taskWithRelations) {
            throw new Error('생성된 태스크를 조회할 수 없습니다.');
        }

        this.logger.log(`Task created successfully: ${task.id}`);

        return plainToInstance(TaskResponseDto, taskWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
