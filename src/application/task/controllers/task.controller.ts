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
import { ApiDataResponse, ApiPaginatedResponse, ApiArrayResponse } from '@src/common/decorators/api-response.decorator';
import { TaskService } from '../task.service';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, GetTasksQueryDto, TaskResponseDto } from '../dtos';
import { ErrorResponseDto } from '@src/common/dtos/response.dto';
import { TaskStatus } from '@src/common/enums/task-status.enum';

@ApiTags('태스크')
@Controller({ path: 'tasks', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    @ApiOperation({
        summary: '태스크 생성',
        description: '새로운 태스크를 생성합니다. 프로젝트 멤버만 생성할 수 있습니다.',
    })
    @ApiBody({
        type: CreateTaskDto,
        description: '태스크 생성 정보',
    })
    @ApiDataResponse(TaskResponseDto, {
        status: HttpStatus.CREATED,
        description: '태스크가 성공적으로 생성되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트 또는 담당자를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '태스크를 생성할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async createTask(@Body() createTaskDto: CreateTaskDto, @User('id') userId: string): Promise<TaskResponseDto> {
        return this.taskService.createTask(createTaskDto, userId);
    }

    @Get()
    @ApiOperation({
        summary: '태스크 목록 조회',
        description: '필터링과 페이지네이션을 지원하는 태스크 목록을 조회합니다.',
    })
    @ApiQuery({
        name: 'projectId',
        description: '프로젝트 ID',
        required: false,
        format: 'uuid',
    })
    @ApiQuery({
        name: 'assigneeId',
        description: '담당자 ID',
        required: false,
        format: 'uuid',
    })
    @ApiQuery({
        name: 'status',
        description: '태스크 상태',
        required: false,
        enum: TaskStatus,
    })
    @ApiQuery({
        name: 'search',
        description: '검색어',
        required: false,
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
        example: 20,
    })
    @ApiPaginatedResponse(TaskResponseDto, {
        description: '태스크 목록 조회가 성공적으로 완료되었습니다.',
    })
    async getTasks(@Query() query: GetTasksQueryDto): Promise<any> {
        return this.taskService.getTasks(query);
    }

    @Get('project/:projectId')
    @ApiOperation({
        summary: '프로젝트별 태스크 조회',
        description: '특정 프로젝트의 모든 태스크를 조회합니다.',
    })
    @ApiParam({
        name: 'projectId',
        description: '프로젝트 ID',
        format: 'uuid',
    })
    @ApiArrayResponse(TaskResponseDto, {
        description: '프로젝트 태스크 목록 조회가 성공적으로 완료되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '프로젝트 태스크를 조회할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getTasksByProject(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @User('id') userId: string,
    ): Promise<TaskResponseDto[]> {
        return this.taskService.getTasksByProject(projectId, userId);
    }

    @Get('project/:projectId/status/:status/all')
    @ApiOperation({
        summary: '프로젝트와 상태별 태스크 조회',
        description: '특정 프로젝트의 특정 상태 태스크를 페이지네이션으로 조회합니다.',
    })
    @ApiParam({
        name: 'projectId',
        description: '프로젝트 ID',
        format: 'uuid',
    })
    @ApiParam({
        name: 'status',
        description: '태스크 상태',
        enum: TaskStatus,
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
        example: 20,
    })
    @ApiDataResponse(Object, {
        description: '프로젝트와 상태별 태스크 조회가 성공적으로 완료되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '프로젝트를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '프로젝트 태스크를 조회할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getTasksByProjectAndStatus(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('status') status: TaskStatus,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @User('id') userId: string,
    ): Promise<{ data: TaskResponseDto[]; meta: any }> {
        return this.taskService.getTasksByProjectAndStatus(projectId, status, page, limit, userId);
    }

    @Get(':id')
    @ApiOperation({
        summary: '태스크 상세 조회',
        description: 'ID로 특정 태스크의 상세 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'id',
        description: '태스크 ID',
        format: 'uuid',
    })
    @ApiDataResponse(TaskResponseDto, {
        description: '태스크 상세 정보 조회가 성공적으로 완료되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '태스크를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '태스크를 조회할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async getTask(@Param('id', ParseUUIDPipe) taskId: string, @User('id') userId: string): Promise<TaskResponseDto> {
        return this.taskService.getTask(taskId, userId);
    }

    @Put(':id')
    @ApiOperation({
        summary: '태스크 정보 수정',
        description: '태스크 정보를 수정합니다. 매니저 이상 또는 태스크 생성자만 수정할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '태스크 ID',
        format: 'uuid',
    })
    @ApiBody({
        type: UpdateTaskDto,
        description: '수정할 태스크 정보',
    })
    @ApiDataResponse(TaskResponseDto, {
        description: '태스크 정보가 성공적으로 수정되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '태스크 또는 담당자를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '태스크를 수정할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async updateTask(
        @Param('id', ParseUUIDPipe) taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @User('id') userId: string,
    ): Promise<TaskResponseDto> {
        return this.taskService.updateTask(taskId, updateTaskDto, userId);
    }

    @Put(':id/status')
    @ApiOperation({
        summary: '태스크 상태 변경',
        description: '태스크의 상태를 변경합니다. 프로젝트 멤버, 담당자 또는 생성자가 변경할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '태스크 ID',
        format: 'uuid',
    })
    @ApiBody({
        type: UpdateTaskStatusDto,
        description: '변경할 태스크 상태',
    })
    @ApiDataResponse(TaskResponseDto, {
        description: '태스크 상태가 성공적으로 변경되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '태스크를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '태스크 상태를 변경할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async updateTaskStatus(
        @Param('id', ParseUUIDPipe) taskId: string,
        @Body() updateStatusDto: UpdateTaskStatusDto,
        @User('id') userId: string,
    ): Promise<TaskResponseDto> {
        return this.taskService.updateTaskStatus(taskId, updateStatusDto, userId);
    }

    @Delete(':id')
    @ApiOperation({
        summary: '태스크 삭제',
        description: '태스크를 삭제합니다. 매니저 이상 또는 태스크 생성자만 삭제할 수 있습니다.',
    })
    @ApiParam({
        name: 'id',
        description: '태스크 ID',
        format: 'uuid',
    })
    @ApiDataResponse(null, {
        status: HttpStatus.NO_CONTENT,
        description: '태스크가 성공적으로 삭제되었습니다.',
        additionalErrors: [
            ApiNotFoundResponse({
                description: '태스크를 찾을 수 없습니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '태스크를 삭제할 권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        ],
    })
    async deleteTask(@Param('id', ParseUUIDPipe) taskId: string, @User('id') userId: string): Promise<void> {
        return this.taskService.deleteTask(taskId, userId);
    }
}
