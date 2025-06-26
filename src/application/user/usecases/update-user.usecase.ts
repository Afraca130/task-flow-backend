import { Injectable, Logger, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { DomainUserService } from '@/domain/user/user.service';
import { DomainProjectService } from '@/domain/project/project.service';
import { DomainProjectMemberService } from '@/domain/project-member/project-member.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { ProjectMemberRole } from '@/common/enums/project-member-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserUseCase {
    private readonly logger = new Logger(UpdateUserUseCase.name);

    constructor(
        private readonly domainUserService: DomainUserService,
        private readonly domainProjectService: DomainProjectService,
        private readonly domainProjectMemberService: DomainProjectMemberService,
    ) {}

    async execute(userId: string, updateUserDto: UpdateUserDto, requestUserId: string): Promise<UserResponseDto> {
        this.logger.log(`Updating user: ${userId} by user: ${requestUserId}`);

        // 수정 권한 확인 (본인 또는 관리자만 수정 가능)
        if (userId !== requestUserId) {
            // 현재는 본인만 수정 가능하도록 제한
            // 추후 관리자 권한 체크 로직 추가 가능
            throw new ForbiddenException('본인의 정보만 수정할 수 있습니다.');
        }

        // 사용자 존재 확인
        const existingUser = await this.domainUserService.findOne({
            where: { id: userId },
        });

        if (!existingUser) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // lastProjectId 유효성 검증
        if (updateUserDto.lastProjectId) {
            const project = await this.domainProjectService.findOne({
                where: { id: updateUserDto.lastProjectId },
            });

            if (!project) {
                throw new NotFoundException('지정된 프로젝트를 찾을 수 없습니다.');
            }

            // 사용자가 해당 프로젝트의 멤버인지 확인
            const isMember = await this.domainProjectMemberService.hasPermission(
                updateUserDto.lastProjectId,
                userId,
                ProjectMemberRole.MEMBER,
            );

            if (!isMember) {
                throw new ForbiddenException('해당 프로젝트의 멤버가 아닙니다.');
            }
        }

        // 업데이트 데이터 준비
        const updateData: any = {};

        if (updateUserDto.name !== undefined) {
            updateData.name = updateUserDto.name;
        }

        if (updateUserDto.profileColor !== undefined) {
            updateData.profileColor = updateUserDto.profileColor;
        }

        if (updateUserDto.isActive !== undefined) {
            updateData.isActive = updateUserDto.isActive;
        }

        if (updateUserDto.lastProjectId !== undefined) {
            updateData.lastProjectId = updateUserDto.lastProjectId;
        }

        // 비밀번호 처리 (해시화)
        if (updateUserDto.password !== undefined) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateUserDto.password, saltRounds);
            this.logger.log(`Password updated for user: ${userId}`);
        }

        // 사용자 정보 업데이트
        const updatedUser = await this.domainUserService.update(userId, updateData);

        this.logger.log(`User updated successfully: ${userId}`);

        // Response DTO로 변환
        return new UserResponseDto({
            ...updatedUser,
            createdAt: updatedUser.createdAt?.toISOString(),
            updatedAt: updatedUser.updatedAt?.toISOString(),
            lastLoginAt: updatedUser.lastLoginAt?.toISOString(),
        });
    }
}
