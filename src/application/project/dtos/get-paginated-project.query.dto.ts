import { ApiPropertyOptional } from '@nestjs/swagger/dist';
import { PaginationQueryDto } from '@src/common/dtos/paginate-query.dto';

export class GetPaginatedProjectQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: '프로젝트 공개 여부',
        type: Boolean,
        default: false,
    })
    isPublic: boolean;
}
