import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { ProjectInvitation } from '../entities/project-invitation.entity';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';
import { IRepositoryOptions } from '@src/common/interfaces/repository.interface';

@Injectable()
export class DomainInvitationRepository extends BaseRepository<ProjectInvitation> {
    constructor(
        @InjectRepository(ProjectInvitation)
        private readonly invitationRepository: Repository<ProjectInvitation>,
    ) {
        super(invitationRepository);
    }

    async markExpiredInvitations(repositoryOptions: IRepositoryOptions<ProjectInvitation>): Promise<void> {
        const repository = repositoryOptions?.queryRunner
            ? repositoryOptions.queryRunner.manager.getRepository(this.repository.target)
            : this.repository;

        await repository.update(
            { status: InvitationStatus.PENDING, expiresAt: LessThan(new Date()) },
            { status: InvitationStatus.EXPIRED },
        );
    }
}
