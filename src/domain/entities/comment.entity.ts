import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from '@src/common/entity/base.entity';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('comments')
export class Comment extends Base {
    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'task_id', type: 'uuid' })
    taskId: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'parent_id', type: 'uuid', nullable: true })
    parentId?: string;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;

    // Relations
    @ManyToOne(() => Task, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_id' })
    parent?: Comment;

    @OneToMany(() => Comment, (comment) => comment.parent)
    replies?: Comment[];
}
