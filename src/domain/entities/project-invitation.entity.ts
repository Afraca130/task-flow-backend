import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '@src/common/entity/base.entity';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('project_invitations')
export class ProjectInvitation extends Base {
    @Column({ name: 'project_id', type: 'uuid' })
    projectId: string;

    @Column({ name: 'inviter_id', type: 'uuid' })
    inviterId: string;

    @Column({ name: 'invitee_id', type: 'uuid', nullable: true })
    inviteeId?: string;

    @Column({
        type: 'enum',
        enum: InvitationStatus,
        default: InvitationStatus.PENDING,
    })
    status: InvitationStatus;

    @Column({ name: 'token', type: 'varchar', length: 255, unique: true })
    token: string;

    @Column({ name: 'message', type: 'text', nullable: true })
    message?: string;

    @Column({ name: 'expires_at', type: 'timestamp' })
    expiresAt: Date;

    @Column({ name: 'responded_at', type: 'timestamp', nullable: true })
    respondedAt?: Date;

    // Relations
    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'inviter_id' })
    inviter: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'invitee_id' })
    invitee?: User;
}
