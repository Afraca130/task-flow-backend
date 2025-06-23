import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/domain/entities/user.entity';
import { BaseRepository } from '@src/common/repositories/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class DomainUserRepository extends BaseRepository<User> {
    constructor(
        @InjectRepository(User)
        repository: Repository<User>,
    ) {
        super(repository);
    }
}
