import { Base } from '@src/common/entity/base.entity';
import { ApprovalType } from '@src/common/enums/approval-type.enum';
import { ProjectStatus } from '@src/common/enums/project-status.enum';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Project extends Base {
    @Exclude()
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    ownerId: string;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.ACTIVE,
    })
    status: ProjectStatus;

    @Column({ default: true })
    isPublic: boolean;

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column({ unique: true, nullable: true })
    inviteCode: string;

    @Column({
        type: 'enum',
        enum: ApprovalType,
        default: ApprovalType.AUTO,
    })
    approvalType: ApprovalType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;
}
