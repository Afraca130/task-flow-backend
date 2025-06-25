import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Base } from '@src/common/entity/base.entity';
import { IssueType } from '@src/common/enums/issue-type.enum';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('issues')
@Index(['projectId', 'type'])
@Index(['authorId'])
@Index(['projectId', 'createdAt'])
export class Issue extends Base {
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: IssueType,
        default: IssueType.BUG,
    })
    type: IssueType;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId: string;

    @Column({ name: 'project_id', type: 'uuid' })
    projectId: string;

    // Relations
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
