import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { DomainCommentRepository } from './comment.repository';
import { DomainCommentService } from './comment.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comment])],
    providers: [DomainCommentRepository, DomainCommentService],
    exports: [DomainCommentRepository, DomainCommentService],
})
export class DomainCommentModule {}
