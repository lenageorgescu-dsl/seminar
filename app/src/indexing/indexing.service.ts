import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HealthService } from '../health/health.service';
import { TypesenseService } from '../typesense/typesense.service';
import { MeiliService } from '../meili/meili.service';
import { ElasticService } from '../elastic/elastic.service';

@Injectable()
export class IndexingService implements OnApplicationBootstrap {
  constructor(
    private healthService: HealthService,
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async onApplicationBootstrap() {
    // await this.healthService.checkHealth();
    // await this.typesense.createCollection();
    // await this.typesense.addDataToCollection();
    // await this.typesense.searchCollection();
    // await this.meili.createCollection();
    // await this.meili.searchCollection();
    await this.elastic.createCollection();
    await this.elastic.searchCollection();
  }
}
