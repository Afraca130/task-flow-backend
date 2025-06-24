import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { ProjectInvitation } from '../entities/project-invitation.entity';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';

@Injectable()
export class DomainInvitationRepository extends BaseRepository<ProjectInvitation> {
    constructor(
        @InjectRepository(ProjectInvitation)
        private readonly invitationRepository: Repository<ProjectInvitation>,
    ) {
        super(invitationRepository);
    }

    async findByToken(token: string): Promise<ProjectInvitation | null> {
        return this.invitationRepository.findOne({
            where: { inviteToken: token },
            relations: ['project', 'inviter', 'invitee'],
        });
    }

    async findByProjectId(projectId: string): Promise<ProjectInvitation[]> {
        return this.invitationRepository.find({
            where: { projectId },
            relations: ['inviter', 'invitee'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByInviteeId(inviteeId: string, status?: InvitationStatus): Promise<ProjectInvitation[]> {
        const where: any = { inviteeId };
        if (status) {
            where.status = status;
        }

        return this.invitationRepository.find({
            where,
            relations: ['project', 'inviter'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByInviteeEmail(email: string, status?: InvitationStatus): Promise<ProjectInvitation[]> {
        const where: any = { inviteeEmail: email };
        if (status) {
            where.status = status;
        }

        return this.invitationRepository.find({
            where,
            relations: ['project', 'inviter'],
            order: { createdAt: 'DESC' },
        });
    }

    async findPendingByProjectAndEmail(projectId: string, email: string): Promise<ProjectInvitation | null> {
        return this.invitationRepository.findOne({
            where: {
                projectId,
                inviteeEmail: email,
                status: InvitationStatus.PENDING,
            },
        });
    }

    async markExpiredInvitations(): Promise<void> {
        await this.invitationRepository
            .createQueryBuilder()
            .update(ProjectInvitation)
            .set({ status: InvitationStatus.EXPIRED })
            .where('status = :status', { status: InvitationStatus.PENDING })
            .andWhere('expiresAt < :now', { now: new Date() })
            .execute();
    }
}
