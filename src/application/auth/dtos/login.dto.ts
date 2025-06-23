import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: '이메일' })
    email: string;

    @ApiProperty({ description: '비밀번호' })
    password: string;
}
