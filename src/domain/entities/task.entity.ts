import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { Base } from '@src/common/entity/base.entity';
import { TaskStatus } from '@src/common/enums/task-status.enum';
import { TaskPriority } from '@src/common/enums/task-priority.enum';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('tasks')
export class Task extends Base {
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status: TaskStatus;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;

    @Column({ name: 'assignee_id', type: 'uuid', nullable: true })
    assigneeId?: string;

    @Column({ name: 'assigner_id', type: 'uuid' })
    assignerId: string;

    @Column({ name: 'project_id', type: 'uuid' })
    projectId: string;

    @Column({ name: 'due_date', type: 'timestamp', nullable: true })
    dueDate?: Date;

    @Column({ type: 'simple-array', nullable: true })
    tags?: string[];

    @Column({ name: 'lexo_rank', type: 'varchar', length: 100 })
    lexoRank: string;

    // Relations
    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assignee_id' })
    assignee?: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'assigner_id' })
    assigner: User;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    // TODO: Comment 엔티티가 생성되면 추가
    // @OneToMany(() => Comment, (comment) => comment.task)
    // comments?: Comment[];
}
