import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DeleteResult } from 'typeorm';

@Injectable()
export class DeleteProjectUseCase {
    constructor(private readonly projectService: DomainProjectService) {}

    async execute(projectId: string, userId: string): Promise<DeleteResult> {
        const project = await this.projectService.findOne({ where: { id: projectId } as any });
        if (!project) {
            const error = new NotFoundException('프로젝트를 찾을 수 없습니다.');
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.', error);
        }

        // 소유자 권한 체크
        if (userId && project.ownerId !== userId) {
            throw new ForbiddenException('프로젝트 삭제 권한이 없습니다.');
        }

        try {
            const result = await this.projectService.deleteProject(projectId);

            if (result.affected === 0) {
                throw new BadRequestException('프로젝트 삭제에 실패했습니다.');
            }

            return result;
        } catch (error) {
            throw new BadRequestException('프로젝트 삭제에 실패했습니다.', { cause: error });
        }
    }
}
