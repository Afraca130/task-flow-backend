import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { Public } from '@src/common/decorators/pulic.decorator';
import { ApiDataResponse, ApiArrayResponse } from '@src/common/decorators/api-response.decorator';
import { CreateInvitationDto } from '../dtos/create-invitation.dto';
import { ProjectInvitationResponseDto } from '../dtos/invitation-response.dto';
import { InvitationService } from '../invitation.service';
import { ErrorResponseDto } from '@src/common/dtos/response.dto';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';

@ApiTags('프로젝트 초대')
@Controller({ path: 'invitations', version: '1' })
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '프로젝트 초대 생성',
        description: '프로젝트에 사용자를 초대합니다. 프로젝트 소유자만 초대할 수 있습니다.',
    })
    @ApiBody({
        type: CreateInvitationDto,
        description: '초대 생성 정보',
    })
    @ApiDataResponse({
        status: HttpStatus.CREATED,
        description: '초대가 성공적으로 생성되었습니다.',
        type: ProjectInvitationResponseDto,
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '초대 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiConflictResponse({
                description: '이미 초대된 사용자입니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async createInvitation(@Body() createInvitationDto: CreateInvitationDto, @User('id') userId: string) {
        return this.invitationService.createInvitation(createInvitationDto, userId);
    }

    @Post(':token/accept')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '초대 수락',
        description: '프로젝트 초대를 수락합니다.',
    })
    @ApiParam({
        name: 'token',
        description: '초대 토큰',
        type: 'string',
    })
    @ApiDataResponse({
        status: HttpStatus.NO_CONTENT,
        description: '초대가 성공적으로 수락되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '초대를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '이 초대를 수락할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async acceptInvitation(@Param('token') token: string, @User('id') userId: string) {
        return this.invitationService.acceptInvitation(token, userId);
    }

    @Post(':token/decline')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '초대 거절',
        description: '프로젝트 초대를 거절합니다.',
    })
    @ApiParam({
        name: 'token',
        description: '초대 토큰',
        type: 'string',
    })
    @ApiDataResponse({
        status: HttpStatus.NO_CONTENT,
        description: '초대가 성공적으로 거절되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '초대를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '이 초대를 거절할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async declineInvitation(@Param('token') token: string, @User('id') userId: string) {
        return this.invitationService.declineInvitation(token, userId);
    }

    @Get(':token')
    @Public()
    @ApiOperation({
        summary: '초대 정보 조회',
        description: '초대 토큰으로 초대 정보를 조회합니다. 인증 없이 접근 가능합니다.',
    })
    @ApiParam({
        name: 'token',
        description: '초대 토큰',
        type: 'string',
    })
    @ApiDataResponse({
        description: '초대 정보 조회가 성공적으로 완료되었습니다.',
        type: ProjectInvitationResponseDto,
        includeAuth: false,
        additionalErrors: [
            ApiNotFoundResponse({
                description: '초대를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getInvitation(@Param('token') token: string) {
        return this.invitationService.getInvitation(token);
    }

    @Get('project/:projectId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '프로젝트별 초대 목록 조회',
        description: '특정 프로젝트의 초대 목록을 조회합니다. 프로젝트 소유자만 조회할 수 있습니다.',
    })
    @ApiParam({
        name: 'projectId',
        description: '프로젝트 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiArrayResponse({
        description: '프로젝트 초대 목록 조회가 성공적으로 완료되었습니다.',
        type: ProjectInvitationResponseDto,
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '초대 목록을 조회할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getProjectInvitations(@Param('projectId', ParseUUIDPipe) projectId: string, @User('id') userId: string) {
        return this.invitationService.getProjectInvitations(projectId, userId);
    }

    @Get('user/received')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '받은 초대 목록 조회',
        description: '현재 사용자가 받은 초대 목록을 조회합니다.',
    })
    @ApiQuery({
        name: 'status',
        description: '초대 상태 필터',
        enum: InvitationStatus,
        required: false,
    })
    @ApiArrayResponse({
        description: '받은 초대 목록 조회가 성공적으로 완료되었습니다.',
        type: ProjectInvitationResponseDto,
    })
    async getReceivedInvitations(@User('id') userId: string, @Query('status') status?: InvitationStatus) {
        return this.invitationService.getUserReceivedInvitations(userId, status);
    }

    @Get('user/pending')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '대기 중인 초대 목록 조회',
        description: '현재 사용자의 대기 중인 초대 목록을 조회합니다.',
    })
    @ApiArrayResponse({
        description: '대기 중인 초대 목록 조회가 성공적으로 완료되었습니다.',
        type: ProjectInvitationResponseDto,
    })
    async getPendingInvitations(@User('id') userId: string) {
        return this.invitationService.getUserPendingInvitations(userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '초대 삭제',
        description: '초대를 삭제합니다. 프로젝트 소유자만 삭제할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '초대 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiDataResponse({
        status: HttpStatus.NO_CONTENT,
        description: '초대가 성공적으로 삭제되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '초대를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '초대를 삭제할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async deleteInvitation(@Param('id', ParseUUIDPipe) invitationId: string, @User('id') userId: string) {
        return this.invitationService.deleteInvitation(invitationId, userId);
    }
}
