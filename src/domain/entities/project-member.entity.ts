import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '@src/common/entity/base.entity';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('project_members')
export class ProjectMember extends Base {
    @Column({ name: 'project_id', type: 'uuid' })
    projectId: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({
        type: 'enum',
        enum: ProjectMemberRole,
        default: ProjectMemberRole.MEMBER,
    })
    role: ProjectMemberRole;

    @Column({ name: 'joined_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;

    @Column({ name: 'invited_by', type: 'uuid', nullable: true })
    invitedBy?: string;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    // Relations
    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'invited_by' })
    inviter?: User;
}
