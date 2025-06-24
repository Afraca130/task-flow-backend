import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { ProjectInvitation } from '../entities/project-invitation.entity';
import { DomainInvitationRepository } from './invitation.repository';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';

@Injectable()
export class DomainInvitationService extends BaseService<ProjectInvitation> {
    constructor(private readonly invitationRepository: DomainInvitationRepository) {
        super(invitationRepository);
    }

    async findByToken(token: string): Promise<ProjectInvitation | null> {
        return this.invitationRepository.findByToken(token);
    }

    async findByProjectId(projectId: string): Promise<ProjectInvitation[]> {
        return this.invitationRepository.findByProjectId(projectId);
    }

    async findByInviteeId(inviteeId: string, status?: InvitationStatus): Promise<ProjectInvitation[]> {
        return this.invitationRepository.findByInviteeId(inviteeId, status);
    }

    async findByInviteeEmail(email: string, status?: InvitationStatus): Promise<ProjectInvitation[]> {
        return this.invitationRepository.findByInviteeEmail(email, status);
    }

    async findPendingByProjectAndEmail(projectId: string, email: string): Promise<ProjectInvitation | null> {
        return this.invitationRepository.findPendingByProjectAndEmail(projectId, email);
    }

    async markExpiredInvitations(): Promise<void> {
        return this.invitationRepository.markExpiredInvitations();
    }

    async updateStatus(
        id: string,
        status: InvitationStatus,
        respondedAt?: Date,
        inviteeId?: string,
    ): Promise<ProjectInvitation> {
        const updateData: Partial<ProjectInvitation> = {
            status,
            respondedAt: respondedAt || new Date(),
        };

        if (inviteeId) {
            updateData.inviteeId = inviteeId;
        }

        return this.update(id, updateData);
    }

    generateInviteToken(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    getExpirationDate(days: number = 7): Date {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
        return expiresAt;
    }
}
