import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from '../entities/project-member.entity';
import { DomainProjectMemberRepository } from './project-member.repository';
import { DomainProjectMemberService } from './project-member.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMember])],
    providers: [DomainProjectMemberRepository, DomainProjectMemberService],
    exports: [DomainProjectMemberRepository, DomainProjectMemberService],
})
export class DomainProjectMemberModule {}
