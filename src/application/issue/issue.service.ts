import { Injectable } from '@nestjs/common';
import { DomainIssueService } from '@src/domain/issue/issue.service';

@Injectable()
export class IssueService {
    constructor(private readonly domainIssueService: DomainIssueService) {}

    // Application Service는 주로 도메인 서비스를 조합하거나
    // 복잡한 비즈니스 로직을 처리하는 용도로 사용됩니다.
    // 현재는 UseCase에서 직접 도메인 서비스를 사용하므로
    // 필요에 따라 추가 로직을 구현할 수 있습니다.
}
