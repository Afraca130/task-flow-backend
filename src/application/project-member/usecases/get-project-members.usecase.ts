import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProjectMemberResponseDto } from '../dtos/project-member-response.dto';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

@Injectable()
export class GetProjectMembersUseCase {
    private readonly logger = new Logger(GetProjectMembersUseCase.name);

    constructor(
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly projectService: DomainProjectService,
    ) {}

    async execute(projectId: string, userId: string): Promise<ProjectMemberResponseDto[]> {
        this.logger.log(`Getting members for project: ${projectId} by user: ${userId}`);

        // 프로젝트 존재 여부 확인
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
            throw new ForbiddenException('프로젝트 멤버 목록을 조회할 권한이 없습니다.');
        }

        // 프로젝트 멤버 목록 조회 - BaseService의 findAll 사용
        const members = await this.projectMemberService.findAll({
            where: { projectId, isActive: true },
            relations: ['user', 'project'],
            order: { joinedAt: 'DESC' },
        });

        this.logger.log(`Found ${members.length} members for project: ${projectId}`);

        return members.map((member) =>
            plainToInstance(ProjectMemberResponseDto, member, {
                excludeExtraneousValues: true,
            }),
        );
    }
}
