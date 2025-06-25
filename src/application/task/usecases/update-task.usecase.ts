import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DomainTaskService } from '@src/domain/task/task.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class UpdateTaskUseCase {
    private readonly logger = new Logger(UpdateTaskUseCase.name);

    constructor(
        private readonly taskService: DomainTaskService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly userService: DomainUserService,
    ) {}

    async execute(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskResponseDto> {
        this.logger.log(`Updating task: ${taskId} by user: ${userId}`);

        const task = await this.taskService.findOne({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundException('태스크를 찾을 수 없습니다.');
        }

        // 프로젝트 멤버 권한 확인 (매니저 이상 또는 태스크 생성자)
        const isManager = await this.projectMemberService.hasPermission(
            task.projectId,
            userId,
            ProjectMemberRole.MANAGER,
        );

        const isCreator = task.assignerId === userId;

        if (!isManager && !isCreator) {
            throw new ForbiddenException('해당 태스크를 수정할 권한이 없습니다.');
        }

        // 담당자 변경 시 검증
        if (updateTaskDto.assigneeId !== undefined) {
            if (updateTaskDto.assigneeId) {
                const assignee = await this.userService.findOne({
                    where: { id: updateTaskDto.assigneeId },
                });

                if (!assignee) {
                    throw new NotFoundException('지정된 담당자를 찾을 수 없습니다.');
                }

                // 담당자가 프로젝트 멤버인지 확인
                const assigneeIsMember = await this.projectMemberService.hasPermission(
                    task.projectId,
                    updateTaskDto.assigneeId,
                    ProjectMemberRole.MEMBER,
                );

                if (!assigneeIsMember) {
                    throw new ForbiddenException('담당자가 해당 프로젝트의 멤버가 아닙니다.');
                }
            }
        }

        // 태스크 업데이트
        const updateData: any = { ...updateTaskDto };
        if (updateTaskDto.dueDate) {
            updateData.dueDate = new Date(updateTaskDto.dueDate);
        }

        const updatedTask = await this.taskService.update(taskId, updateData);

        // 관계 정보와 함께 태스크 조회
        const taskWithRelations = await this.taskService.getTaskWithRelations(updatedTask.id);

        if (!taskWithRelations) {
            throw new Error('업데이트된 태스크를 조회할 수 없습니다.');
        }

        this.logger.log(`Task updated successfully: ${taskId}`);

        return plainToInstance(TaskResponseDto, taskWithRelations, {
            excludeExtraneousValues: true,
        });
    }
}
