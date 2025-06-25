import { Injectable, Logger, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { CreateInvitationDto } from '../dtos/create-invitation.dto';
import { ProjectInvitationResponseDto } from '../dtos/invitation-response.dto';
import { DomainInvitationService } from '@src/domain/invitation/invitation.service';
import { DomainProjectService } from '@src/domain/project/project.service';
import { DomainUserService } from '@src/domain/user/user.service';
import { InvitationStatus } from '@src/common/enums/invitation-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateInvitationUseCase {
    private readonly logger = new Logger(CreateInvitationUseCase.name);

    constructor(
        private readonly invitationService: DomainInvitationService,
        private readonly projectService: DomainProjectService,
        private readonly userService: DomainUserService,
        private readonly dataSource: DataSource,
    ) {}

    async execute(createInvitationDto: CreateInvitationDto, inviterId: string): Promise<ProjectInvitationResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            this.logger.log(`Creating invitation for project: ${createInvitationDto.projectId}`);

            // 프로젝트 존재 여부 및 권한 확인
            const project = await this.projectService.findOne({
                where: { id: createInvitationDto.projectId },
                queryRunner,
            });

            if (!project) {
                throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
            }

            // 프로젝트 접근 권한 확인 (소유자만 초대 가능)
            if (project.ownerId !== inviterId) {
                throw new ForbiddenException('초대 권한이 없습니다.');
            }

            // 이미 초대된 사용자인지 확인
            const existingInvitation = await this.invitationService.findOne({
                where: {
                    projectId: createInvitationDto.projectId,
                    inviteeId: createInvitationDto.inviteeId,
                    status: InvitationStatus.PENDING,
                },
                queryRunner,
            });

            if (existingInvitation) {
                throw new ConflictException('이미 초대된 사용자입니다.');
            }

            // 초대받을 사용자 정보 조회 (선택적)
            const inviteeUser = await this.userService.findOne({
                where: { id: createInvitationDto.inviteeId },
                queryRunner,
            });

            // 초대 생성
            const invitationData = {
                projectId: createInvitationDto.projectId,
                inviterId: inviterId,
                inviteeId: inviteeUser?.id,
                token: this.generateToken(),
                message: createInvitationDto.message,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 만료
                status: InvitationStatus.PENDING,
            };

            const savedInvitation = await this.invitationService.save(invitationData, { queryRunner });

            const invitation = await this.invitationService.findOne({
                where: { token: savedInvitation.token },
                relations: ['project', 'inviter', 'invitee'],
                queryRunner,
            });

            await queryRunner.commitTransaction();
            this.logger.log(`Invitation created successfully: ${savedInvitation.id}`);

            return plainToInstance(ProjectInvitationResponseDto, invitation, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to create invitation', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private generateToken(): string {
        return uuidv4() + Date.now().toString(36);
    }
}
