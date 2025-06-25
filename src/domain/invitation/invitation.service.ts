import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/common/services/base.service';
import { ProjectInvitation } from '../entities/project-invitation.entity';
import { DomainInvitationRepository } from './invitation.repository';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';
import { QueryRunner } from 'typeorm';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainInvitationService extends BaseService<ProjectInvitation> {
    constructor(private readonly invitationRepository: DomainInvitationRepository) {
        super(invitationRepository);
    }

    async markExpiredInvitations(options: IRepositoryOptions<ProjectInvitation>): Promise<void> {
        return this.invitationRepository.markExpiredInvitations(options);
    }
}
