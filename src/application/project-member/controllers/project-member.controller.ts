import { Controller, Get, Patch, Delete, Param, Body, UseGuards, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { ApiArrayResponse, ApiDataResponse } from '@src/common/decorators/api-response.decorator';
import { ProjectMemberService } from '../project-member.service';
import { UpdateMemberRoleDto } from '../dtos/update-member-role.dto';
import { ProjectMemberResponseDto } from '../dtos/project-member-response.dto';
import { ErrorResponseDto } from '@src/common/dtos/response.dto';

@ApiTags('project-members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'projects/:projectId/members', version: '1' })
export class ProjectMemberController {
    constructor(private readonly projectMemberService: ProjectMemberService) {}

    @Get()
    @ApiOperation({
        summary: '프로젝트 멤버 목록 조회',
        description: '특정 프로젝트의 모든 멤버 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'projectId',
        description: '프로젝트 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiArrayResponse(ProjectMemberResponseDto, {
        status: HttpStatus.OK,
        description: '프로젝트 멤버 목록 조회 성공',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getProjectMembers(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @User('id') userId: string,
    ): Promise<ProjectMemberResponseDto[]> {
        return this.projectMemberService.getProjectMembers(projectId, userId);
    }

    @Patch(':userId/role')
    @ApiOperation({
        summary: '멤버 역할 변경',
        description: '프로젝트 멤버의 역할을 변경합니다. 소유자 또는 매니저만 변경 가능합니다.',
    })
    @ApiParam({
        name: 'projectId',
        description: '프로젝트 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiParam({
        name: 'userId',
        description: '역할을 변경할 사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiDataResponse(null, {
        status: HttpStatus.OK,
        description: '멤버 역할 변경 성공',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트 또는 사용자를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async updateMemberRole(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('userId', ParseUUIDPipe) targetUserId: string,
        @Body() updateRoleDto: UpdateMemberRoleDto,
        @User('id') requestUserId: string,
    ): Promise<void> {
        return this.projectMemberService.updateMemberRole(projectId, targetUserId, updateRoleDto.role, requestUserId);
    }

    @Delete(':userId')
    @ApiOperation({
        summary: '프로젝트 멤버 제거',
        description: '프로젝트에서 멤버를 제거합니다. 소유자 또는 매니저만 제거 가능하며, 본인은 탈퇴 가능합니다.',
    })
    @ApiParam({
        name: 'projectId',
        description: '프로젝트 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiParam({
        name: 'userId',
        description: '제거할 사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiDataResponse(null, {
        status: HttpStatus.OK,
        description: '멤버 제거 성공',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트 또는 사용자를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async removeProjectMember(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('userId', ParseUUIDPipe) targetUserId: string,
        @User('id') requestUserId: string,
    ): Promise<void> {
        return this.projectMemberService.removeProjectMember(projectId, targetUserId, requestUserId);
    }
}
