import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '@src/common/entity/base.entity';
import { User } from './user.entity';

@Entity('notifications')
export class Notification extends Base {
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ type: 'varchar', length: 100 })
    type: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ name: 'is_read', type: 'boolean', default: false })
    isRead: boolean;

    @Column({ name: 'read_at', type: 'timestamp', nullable: true })
    readAt?: Date;

    @Column({ name: 'data', type: 'jsonb', nullable: true })
    data?: Record<string, any>;

    // Relations
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
