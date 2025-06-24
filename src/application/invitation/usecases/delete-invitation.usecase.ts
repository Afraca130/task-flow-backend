import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DomainInvitationService } from '@src/domain/invitation/invitation.service';
import { DomainProjectService } from '@src/domain/project/project.service';

@Injectable()
export class DeleteInvitationUseCase {
    private readonly logger = new Logger(DeleteInvitationUseCase.name);

    constructor(
        private readonly invitationService: DomainInvitationService,
        private readonly projectService: DomainProjectService,
    ) {}

    async execute(invitationId: string, userId: string): Promise<void> {
        try {
            this.logger.log(`Deleting invitation: ${invitationId} by user: ${userId}`);

            // 초대 조회
            const invitation = await this.invitationService.findOne({
                where: { id: invitationId },
            });

            if (!invitation) {
                throw new NotFoundException('초대를 찾을 수 없습니다.');
            }

            // 프로젝트 조회
            const project = await this.projectService.findOne({
                where: { id: invitation.projectId },
            });

            if (!project) {
                throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
            }

            // 권한 확인 (프로젝트 소유자만 삭제 가능)
            if (project.ownerId !== userId) {
                throw new ForbiddenException('초대를 삭제할 권한이 없습니다.');
            }

            // 초대 삭제
            await this.invitationService.delete(invitationId);

            this.logger.log(`Invitation deleted successfully: ${invitationId}`);
        } catch (error) {
            this.logger.error(`Failed to delete invitation: ${invitationId}`, error);
            throw error;
        }
    }
}
