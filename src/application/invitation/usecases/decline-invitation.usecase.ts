import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DomainInvitationService } from '@src/domain/invitation/invitation.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';

@Injectable()
export class DeclineInvitationUseCase {
    private readonly logger = new Logger(DeclineInvitationUseCase.name);

    constructor(
        private readonly invitationService: DomainInvitationService,
        private readonly userService: DomainUserService,
        private readonly dataSource: DataSource,
    ) {}

    async execute(token: string, userId?: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            this.logger.log(`Declining invitation with token: ${token}`);

            // 먼저 만료된 초대들을 정리
            await this.invitationService.markExpiredInvitations({ queryRunner });

            // 초대 조회
            const invitation = await this.invitationService.findOne({
                where: { inviteToken: token },
                queryRunner,
            });

            if (!invitation) {
                throw new NotFoundException('초대를 찾을 수 없습니다.');
            }

            // 초대 상태 확인
            if (invitation.status !== InvitationStatus.PENDING) {
                throw new BadRequestException('이미 처리된 초대입니다.');
            }

            // 만료 확인
            if (new Date() > invitation.expiresAt) {
                await this.invitationService.update(
                    invitation.id,
                    {
                        status: InvitationStatus.EXPIRED,
                        respondedAt: new Date(),
                    },
                    { queryRunner },
                );
                throw new BadRequestException('만료된 초대입니다.');
            }

            // 사용자 권한 확인
            if (userId) {
                const user = await this.userService.findOne({
                    where: { id: userId },
                    queryRunner,
                });

                if (!user) {
                    throw new ForbiddenException('사용자를 찾을 수 없습니다.');
                }

                // 초대받은 이메일과 현재 사용자의 이메일이 일치하는지 확인
                if (user.email !== invitation.inviteeEmail) {
                    throw new ForbiddenException('이 초대를 거절할 권한이 없습니다.');
                }

                // 초대 거절
                await this.invitationService.update(
                    invitation.id,
                    {
                        status: InvitationStatus.REJECTED,
                        respondedAt: new Date(),
                        inviteeId: userId,
                    },
                    { queryRunner },
                );
            } else {
                // 익명 사용자의 경우 이메일만으로 거절
                await this.invitationService.update(
                    invitation.id,
                    {
                        status: InvitationStatus.REJECTED,
                        respondedAt: new Date(),
                    },
                    { queryRunner },
                );
            }

            await queryRunner.commitTransaction();
            this.logger.log(`Invitation declined successfully: ${invitation.id}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to decline invitation with token: ${token}`, error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
