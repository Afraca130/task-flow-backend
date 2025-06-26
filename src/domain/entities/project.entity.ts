import { Base } from '@src/common/entity/base.entity';
import { ProjectPriority } from '@src/common/enums/project-priority.enum';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ProjectMember } from './project-member.entity';
import { Exclude } from 'class-transformer';
import { Task } from './task.entity';

@Entity()
export class Project extends Base {
    @Exclude()
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: '#3B82F6' })
    color: string;

    @Column({
        type: 'enum',
        enum: ProjectPriority,
        default: ProjectPriority.MEDIUM,
    })
    priority: ProjectPriority;

    @Column({ type: 'date', nullable: true })
    dueDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    ownerId: string;

    @Column({ default: true })
    isPublic: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner?: User;

    @OneToMany(() => ProjectMember, (member) => member.project)
    members?: ProjectMember[];

    @OneToMany(() => Task, (task) => task.project)
    tasks?: Task[];
}
