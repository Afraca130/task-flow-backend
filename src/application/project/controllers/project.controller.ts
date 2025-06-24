import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpStatus,
    ParseUUIDPipe,
    NotFoundException,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { User } from '@src/common/decorators/user.decorator';
import { ApiDataResponse, ApiPaginatedResponse } from '@src/common/decorators/api-response.decorator';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto, GetPaginatedProjectQueryDto } from '@src/dtos.index';
import { ProjectService } from '../project.service';
import { ErrorResponseDto } from '@src/common/dtos/response.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('2. 프로젝트')
@Controller({ path: 'projects', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @ApiOperation({
        summary: '프로젝트 생성',
        description: '새로운 프로젝트를 생성합니다.',
    })
    @ApiBody({
        type: CreateProjectDto,
        description: '프로젝트 생성 정보',
    })
    @ApiDataResponse({
        status: HttpStatus.CREATED,
        description: '프로젝트가 성공적으로 생성되었습니다.',
        type: ProjectResponseDto,
        additionalErrors: [
            ApiConflictResponse({
                description: '이미 존재하는 프로젝트명입니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async createProject(@Body() createProjectDto: CreateProjectDto, @User('id') userId: string) {
        return this.projectService.createProject(createProjectDto, userId);
    }

    @Get()
    @ApiOperation({
        summary: '프로젝트 목록 조회',
        description: '페이지네이션과 검색 기능을 지원하는 프로젝트 목록을 조회합니다.',
    })
    @ApiQuery({
        name: 'q',
        description: '검색어 (프로젝트명)',
        required: false,
        example: '프로젝트',
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        required: false,
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        required: false,
        example: 10,
    })
    @ApiPaginatedResponse({
        description: '프로젝트 목록 조회가 성공적으로 완료되었습니다.',
        type: ProjectResponseDto,
    })
    async getProjects(@Query() query: GetPaginatedProjectQueryDto) {
        return this.projectService.getProjects(query);
    }

    @Get(':id')
    @ApiOperation({
        summary: '프로젝트 상세 조회',
        description: 'ID로 특정 프로젝트의 상세 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'id',
        description: '프로젝트 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiDataResponse({
        description: '프로젝트 상세 정보 조회가 성공적으로 완료되었습니다.',
        type: ProjectResponseDto,
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getProjectById(@Param('id', ParseUUIDPipe) projectId: string) {
        const project = await this.projectService.getProjectById(projectId);
        if (!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }
        return project;
    }

    @Put(':id')
    @ApiOperation({
        summary: '프로젝트 정보 수정',
        description: '프로젝트 정보를 수정합니다. 프로젝트 소유자만 수정할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '프로젝트 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiBody({
        type: UpdateProjectDto,
        description: '수정할 프로젝트 정보',
    })
    @ApiDataResponse({
        description: '프로젝트 정보가 성공적으로 수정되었습니다.',
        type: ProjectResponseDto,
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiConflictResponse({
                description: '이미 존재하는 프로젝트명입니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async updateProject(
        @Param('id', ParseUUIDPipe) projectId: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @User('id') userId: string,
    ) {
        return this.projectService.updateProject(projectId, updateProjectDto, userId);
    }

    @Delete(':id')
    @ApiOperation({
        summary: '프로젝트 삭제',
        description: '프로젝트를 삭제합니다. 프로젝트 소유자만 삭제할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '프로젝트 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiDataResponse({
        status: HttpStatus.NO_CONTENT,
        description: '프로젝트가 성공적으로 삭제되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async deleteProject(
        @Param('id', ParseUUIDPipe) projectId: string,
        @User('id') userId: string,
    ): Promise<DeleteResult> {
        return this.projectService.deleteProject(projectId, userId);
    }
}
