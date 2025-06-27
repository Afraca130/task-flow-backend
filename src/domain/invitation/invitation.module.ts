import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectInvitation } from '../entities/project-invitation.entity';
import { DomainInvitationRepository } from './invitation.repository';
import { DomainInvitationService } from './invitation.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectInvitation])],
    providers: [DomainInvitationRepository, DomainInvitationService],
    exports: [DomainInvitationRepository, DomainInvitationService],
})
export class DomainInvitationModule {}
