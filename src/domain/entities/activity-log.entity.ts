import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Base } from '@src/common/entity/base.entity';
import { ActivityEntityType } from '@src/common/enums/activity-entity-type.enum';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('activity_logs')
@Index(['projectId', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['entityId', 'entityType'])
@Index(['projectId', 'entityType', 'createdAt'])
export class ActivityLog extends Base {
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'project_id', type: 'uuid' })
    projectId: string;

    @Column({ name: 'entity_id', type: 'uuid' })
    entityId: string;

    @Column({
        name: 'entity_type',
        type: 'enum',
        enum: ActivityEntityType,
    })
    entityType: ActivityEntityType;

    @Column({ type: 'varchar', length: 100 })
    action: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    // Relations
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
