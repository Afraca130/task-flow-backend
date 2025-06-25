import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '@src/common/enums/task-status.enum';

export class UpdateTaskStatusDto {
    @ApiProperty({
        description: '태스크 상태',
        example: TaskStatus.IN_PROGRESS,
        enum: TaskStatus,
    })
    @IsEnum(TaskStatus, { message: '올바른 상태를 선택하세요.' })
    status: TaskStatus;
}
