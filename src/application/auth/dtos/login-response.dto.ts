import { ApiProperty } from '@nestjs/swagger/dist';
import { UserDto } from './user-response.dto';

export class LoginResponseDto {
    @ApiProperty({
        description: '액세스 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: '사용자 정보',
        type: UserDto,
    })
    user: UserDto;
}
