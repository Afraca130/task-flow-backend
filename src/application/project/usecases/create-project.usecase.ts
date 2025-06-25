import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DateUtil } from '@src/common/utils/date.util';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainProjectMemberService } from '@src/domain/project-member/project-member.service';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { v4 as uuidv4 } from 'uuid';
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
        const { name, description, isPublic, startDate, endDate, approvalType } = createProjectDto;

        // 소유자 프로젝트 중 프로젝트명 중복 체크
        const existProject = await this.projectService.getProjectByNameWithOwnerId(name, userId);
        if (existProject) {
            throw new ConflictException('프로젝트명이 이미 존재합니다.');
        }

        // 날짜 유효성 검사
        if (startDate && endDate && startDate > endDate) {
            throw new ConflictException('시작일은 종료일보다 늦을 수 없습니다.');
        }

        const inviteCode = this.generateInviteCode();

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const createdProject = await this.projectService.create({
                name: name,
                description: description,
                ownerId: userId,
                isPublic: isPublic,
                startDate: DateUtil.date(startDate).toDate(),
                endDate: DateUtil.date(endDate).toDate(),
                inviteCode: inviteCode,
                approvalType: approvalType,
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
            return plainToInstance(ProjectResponseDto, project);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('프로젝트 생성에 실패했습니다.', { cause: error });
        } finally {
            await queryRunner.release();
        }
    }

    generateInviteCode(): string {
        return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    }
}
