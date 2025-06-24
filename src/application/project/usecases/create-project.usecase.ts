import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DateUtil } from '@src/common/utils/date.util';
import { DomainProjectService } from '@src/domain/project/project.service';
import { v4 as uuidv4 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto, ProjectResponseDto } from '@src/dtos.index';

@Injectable()
export class CreateProjectUseCase {
    constructor(private readonly projectService: DomainProjectService) {}

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
            const project = await this.projectService.createProject(createdProject);

            return plainToInstance(ProjectResponseDto, project);
        } catch (error) {
            console.log(error);
            throw new BadRequestException('프로젝트 생성에 실패했습니다.');
        }
    }

    generateInviteCode(): string {
        return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    }
}
