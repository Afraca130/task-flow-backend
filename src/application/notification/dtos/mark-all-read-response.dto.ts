import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MarkAllReadResponseDto {
    @ApiProperty({
        description: '응답 메시지',
        example: '모든 알림을 읽음으로 처리했습니다.',
    })
    @Expose()
    message: string;

    @ApiProperty({
        description: '읽음 처리된 알림 수',
        example: 5,
    })
    @Expose()
    count: number;
}
