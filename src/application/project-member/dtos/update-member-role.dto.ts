import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProjectMemberRole } from '@src/common/enums/project-member-role.enum';

export class UpdateMemberRoleDto {
    @ApiProperty({
        description: '새로운 멤버 역할',
        example: ProjectMemberRole.MANAGER,
        enum: ProjectMemberRole,
    })
    @IsEnum(ProjectMemberRole, { message: '올바른 역할을 선택하세요.' })
    role: ProjectMemberRole;
}
