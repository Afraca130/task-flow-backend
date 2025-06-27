import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { DomainTaskRepository } from './task.repository';
import { DomainTaskService } from './task.service';

@Module({
    imports: [TypeOrmModule.forFeature([Task])],
    providers: [DomainTaskRepository, DomainTaskService],
    exports: [DomainTaskRepository, DomainTaskService],
})
export class DomainTaskModule {}
