import { Injectable } from '@nestjs/common';
import { CreateInvitationDto, ProjectInvitationResponseDto } from './dtos';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';

import {
    CreateInvitationUseCase,
    AcceptInvitationUseCase,
    DeclineInvitationUseCase,
    GetInvitationUseCase,
    GetProjectInvitationsUseCase,
    GetUserInvitationsUseCase,
    DeleteInvitationUseCase,
} from './usecases/index';

@Injectable()
export class InvitationService {
    constructor(
        private readonly createInvitationUseCase: CreateInvitationUseCase,
        private readonly acceptInvitationUseCase: AcceptInvitationUseCase,
        private readonly declineInvitationUseCase: DeclineInvitationUseCase,
        private readonly getInvitationUseCase: GetInvitationUseCase,
        private readonly getProjectInvitationsUseCase: GetProjectInvitationsUseCase,
        private readonly getUserInvitationsUseCase: GetUserInvitationsUseCase,
        private readonly deleteInvitationUseCase: DeleteInvitationUseCase,
    ) {}

    async createInvitation(
        createInvitationDto: CreateInvitationDto,
        inviterId: string,
    ): Promise<ProjectInvitationResponseDto> {
        return this.createInvitationUseCase.execute(createInvitationDto, inviterId);
    }

    async acceptInvitation(token: string, userId?: string): Promise<void> {
        return this.acceptInvitationUseCase.execute(token, userId);
    }

    async declineInvitation(token: string, userId?: string): Promise<void> {
        return this.declineInvitationUseCase.execute(token, userId);
    }

    async getInvitation(token: string): Promise<ProjectInvitationResponseDto> {
        return this.getInvitationUseCase.execute(token);
    }

    async getProjectInvitations(projectId: string, userId: string): Promise<ProjectInvitationResponseDto[]> {
        return this.getProjectInvitationsUseCase.execute(projectId, userId);
    }

    async getUserReceivedInvitations(
        userId: string,
        status?: InvitationStatus,
    ): Promise<ProjectInvitationResponseDto[]> {
        return this.getUserInvitationsUseCase.execute(userId, status);
    }

    async getUserPendingInvitations(userId: string): Promise<ProjectInvitationResponseDto[]> {
        return this.getUserInvitationsUseCase.execute(userId, InvitationStatus.PENDING);
    }

    async deleteInvitation(invitationId: string, userId: string): Promise<void> {
        return this.deleteInvitationUseCase.execute(invitationId, userId);
    }
}
