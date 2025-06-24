import { Injectable, Logger, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
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
    ) {}

    async execute(createInvitationDto: CreateInvitationDto, inviterId: string): Promise<ProjectInvitationResponseDto> {
        try {
            this.logger.log(`Creating invitation for project: ${createInvitationDto.projectId}`);

            // 프로젝트 존재 여부 및 권한 확인
            const project = await this.projectService.findOne({
                where: { id: createInvitationDto.projectId },
            });

            if (!project) {
                throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
            }

            // 프로젝트 접근 권한 확인 (소유자만 초대 가능)
            if (project.ownerId !== inviterId) {
                throw new ForbiddenException('초대 권한이 없습니다.');
            }

            // 이미 초대된 사용자인지 확인
            const existingInvitation = await this.invitationService.findPendingByProjectAndEmail(
                createInvitationDto.projectId,
                createInvitationDto.inviteeEmail,
            );

            if (existingInvitation) {
                throw new ConflictException('이미 초대된 사용자입니다.');
            }

            // 초대받을 사용자 정보 조회 (선택적)
            const inviteeUser = await this.userService.findUserByEmail(createInvitationDto.inviteeEmail);

            // 초대 생성
            const invitationData = {
                id: uuidv4(),
                projectId: createInvitationDto.projectId,
                inviterId: inviterId,
                inviteeEmail: createInvitationDto.inviteeEmail,
                inviteeId: inviteeUser?.id,
                status: InvitationStatus.PENDING,
                inviteToken: this.invitationService.generateInviteToken(),
                message: createInvitationDto.message,
                expiresAt: this.invitationService.getExpirationDate(7), // 7일 후 만료
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const invitation = await this.invitationService.create(invitationData);
            const savedInvitation = await this.invitationService.save(invitation);

            // 관계 데이터와 함께 조회
            const invitationWithRelations = await this.invitationService.findByToken(savedInvitation.inviteToken);

            this.logger.log(`Invitation created successfully: ${savedInvitation.id}`);

            return plainToInstance(ProjectInvitationResponseDto, invitationWithRelations, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            this.logger.error('Failed to create invitation', error);
            throw error;
        }
    }
}
