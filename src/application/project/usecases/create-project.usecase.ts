import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto, ProjectResponseDto } from '@src/application/project/dtos';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateProjectUseCase {
    constructor(
        private readonly projectService: DomainProjectService,
        private readonly projectMemberService: DomainProjectMemberService,
        private readonly dataSource: DataSource,
    ) {}

    async execute(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectResponseDto> {
        const { name, description, color, priority, dueDate, isActive, isPublic } = createProjectDto;

        // 소유자 프로젝트 중 프로젝트명 중복 체크
        const existProject = await this.projectService.getProjectByNameWithOwnerId(name, userId);
        if (existProject) {
            throw new ConflictException('프로젝트명이 이미 존재합니다.');
        }

        // 마감일 유효성 검사
        if (dueDate && new Date(dueDate) <= new Date()) {
            throw new BadRequestException('마감일은 현재 시간보다 미래여야 합니다.');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const createdProject = await this.projectService.create({
                name,
                description,
                color,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                isActive,
                ownerId: userId,
                isPublic,
            });
            const project = await this.projectService.save(createdProject, { queryRunner });

            // 프로젝트 생성자를 OWNER 멤버로 추가
            await this.projectMemberService.addMember(
                project.id,
                userId,
                ProjectMemberRole.OWNER,
                undefined, // 프로젝트 생성자는 초대자가 없음
                { queryRunner },
            );

            await queryRunner.commitTransaction();

            // 생성된 프로젝트에 관계 데이터 추가
            const projectWithCounts = await this.projectService.getProjectWithCounts(project.id);
            const response = plainToInstance(ProjectResponseDto, projectWithCounts);

            // memberCount 계산
            response.memberCount = projectWithCounts.members?.length || 0;

            // taskCount는 별도 서비스를 통해 계산 (circular dependency 해결)
            response.taskCount = 0; // 임시로 0 설정

            return response;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('프로젝트 생성에 실패했습니다.', { cause: error });
        } finally {
            await queryRunner.release();
        }
    }
}
