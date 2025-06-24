import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProjectInvitationResponseDto } from '../dtos/invitation-response.dto';
import { DomainInvitationService } from '@src/domain/invitation/invitation.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';

@Injectable()
export class GetUserInvitationsUseCase {
    private readonly logger = new Logger(GetUserInvitationsUseCase.name);

    constructor(
        private readonly invitationService: DomainInvitationService,
        private readonly userService: DomainUserService,
    ) {}

    async execute(userId: string, status?: InvitationStatus): Promise<ProjectInvitationResponseDto[]> {
        try {
            this.logger.log(`Getting invitations for user: ${userId}, status: ${status || 'all'}`);

            // 사용자 정보 조회
            const user = await this.userService.findById(userId);
            if (!user) {
                return [];
            }

            // 먼저 만료된 초대들을 정리
            await this.invitationService.markExpiredInvitations();

            // 사용자의 초대 목록 조회 (ID와 이메일 둘 다 확인)
            const invitationsByUserId = await this.invitationService.findByInviteeId(userId, status);
            const invitationsByEmail = await this.invitationService.findByInviteeEmail(user.email, status);

            // 중복 제거 (ID 기준)
            const allInvitations = [...invitationsByUserId];
            invitationsByEmail.forEach((invitation) => {
                if (!allInvitations.find((inv) => inv.id === invitation.id)) {
                    allInvitations.push(invitation);
                }
            });

            this.logger.log(`Found ${allInvitations.length} invitations for user: ${userId}`);

            return allInvitations.map((invitation) =>
                plainToInstance(ProjectInvitationResponseDto, invitation, {
                    excludeExtraneousValues: true,
                }),
            );
        } catch (error) {
            this.logger.error(`Failed to get invitations for user: ${userId}`, error);
            throw error;
        }
    }
}
