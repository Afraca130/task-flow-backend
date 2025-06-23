import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainUserService } from './user.service';
import { User } from '@src/domain/entities/user.entity';
import { DomainUserRepository } from './user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [DomainUserService, DomainUserRepository],
    exports: [DomainUserService],
})
export class DomainUserModule {}
