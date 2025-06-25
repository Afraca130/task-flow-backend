import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DomainInvitationService } from '@src/domain/invitation/invitation.service';
import { DomainProjectService } from '@src/domain/project/project.service';

@Injectable()
export class DeleteInvitationUseCase {
    private readonly logger = new Logger(DeleteInvitationUseCase.name);

    constructor(
        private readonly invitationService: DomainInvitationService,
        private readonly projectService: DomainProjectService,
        private readonly dataSource: DataSource,
    ) {}

    async execute(invitationId: string, userId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            this.logger.log(`Deleting invitation: ${invitationId} by user: ${userId}`);

            // 초대 조회
            const invitation = await this.invitationService.findOne({
                where: { id: invitationId },
                queryRunner,
            });

            if (!invitation) {
                throw new NotFoundException('초대를 찾을 수 없습니다.');
            }

            // 프로젝트 조회
            const project = await this.projectService.findOne({
                where: { id: invitation.projectId },
                queryRunner,
            });

            if (!project) {
                throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
            }

            // 권한 확인 (프로젝트 소유자만 삭제 가능)
            if (project.ownerId !== userId) {
                throw new ForbiddenException('초대를 삭제할 권한이 없습니다.');
            }

            // 초대 삭제
            await this.invitationService.delete(invitationId, { queryRunner });

            await queryRunner.commitTransaction();
            this.logger.log(`Invitation deleted successfully: ${invitationId}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to delete invitation: ${invitationId}`, error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
