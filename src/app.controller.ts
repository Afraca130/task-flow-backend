import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { Public } from './common/decorators/pulic.decorator';

@Public()
@Controller('health')
export class AppController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([() => this.db.pingCheck('database')]);
    }
}
