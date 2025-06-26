import { Base } from '@src/common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Comment } from './comment.entity';

@Entity()
export class User extends Base {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ default: '#000000' })
    profileColor: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: null })
    lastLoginAt: Date;

    @Column({ name: 'last_project_id', type: 'uuid', nullable: true })
    lastProjectId: string;

    @OneToMany(() => Project, (project) => project.owner)
    projects: Project[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
}
