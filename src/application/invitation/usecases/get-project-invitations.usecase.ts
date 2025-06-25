import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { ProjectInvitationResponseDto } from '../dtos/invitation-response.dto';
import { DomainInvitationService } from '@src/domain/invitation/invitation.service';
import { DomainProjectService } from '@src/domain/project/project.service';

@Injectable()
export class GetProjectInvitationsUseCase {
    private readonly logger = new Logger(GetProjectInvitationsUseCase.name);

    constructor(
        private readonly invitationService: DomainInvitationService,
        private readonly projectService: DomainProjectService,
        private readonly dataSource: DataSource,
    ) {}

    async execute(projectId: string, userId: string): Promise<ProjectInvitationResponseDto[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            this.logger.log(`Getting invitations for project: ${projectId}`);

            // 프로젝트 존재 여부 및 권한 확인
            const project = await this.projectService.findOne({
                where: { id: projectId },
                queryRunner,
            });

            if (!project) {
                throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
            }

            // 프로젝트 접근 권한 확인 (소유자만 조회 가능)
            if (project.ownerId !== userId) {
                throw new ForbiddenException('초대 목록을 조회할 권한이 없습니다.');
            }

            // 먼저 만료된 초대들을 정리
            await this.invitationService.markExpiredInvitations({ queryRunner });

            // 프로젝트의 초대 목록 조회
            const invitations = await this.invitationService.findAll({
                where: { projectId },
                relations: ['inviter', 'invitee'],
                order: { createdAt: 'DESC' },
                queryRunner,
            });

            await queryRunner.commitTransaction();
            this.logger.log(`Found ${invitations.length} invitations for project: ${projectId}`);

            return invitations.map((invitation) =>
                plainToInstance(ProjectInvitationResponseDto, invitation, {
                    excludeExtraneousValues: true,
                }),
            );
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to get invitations for project: ${projectId}`, error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
