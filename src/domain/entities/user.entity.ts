import { Base } from '@src/common/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends Base {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ default: '#000000' })
    color: string;

    @Column({ default: true })
    isActive: boolean;
}
