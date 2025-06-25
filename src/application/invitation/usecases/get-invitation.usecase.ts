import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { ProjectInvitationResponseDto } from '../dtos/invitation-response.dto';
import { DomainInvitationService } from '@src/domain/invitation/invitation.service';

@Injectable()
export class GetInvitationUseCase {
    private readonly logger = new Logger(GetInvitationUseCase.name);

    constructor(
        private readonly invitationService: DomainInvitationService,
        private readonly dataSource: DataSource,
    ) {}

    async execute(token: string): Promise<ProjectInvitationResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            this.logger.log(`Getting invitation with token: ${token}`);

            // 먼저 만료된 초대들을 정리
            await this.invitationService.markExpiredInvitations({ queryRunner });

            // 초대 조회 (관계 데이터 포함)
            const invitation = await this.invitationService.findOne({
                where: { token },
                relations: ['project', 'inviter', 'invitee'],
                queryRunner,
            });

            if (!invitation) {
                throw new NotFoundException('초대를 찾을 수 없습니다.');
            }

            await queryRunner.commitTransaction();
            this.logger.log(`Invitation found: ${invitation.id}`);

            return plainToInstance(ProjectInvitationResponseDto, invitation, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to get invitation with token: ${token}`, error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
