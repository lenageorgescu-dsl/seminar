import { Injectable } from '@nestjs/common';
import { HealthService } from '../health/health.service';
import { TypesenseService } from '../typesense/typesense.service';
import { MeiliService } from '../meili/meili.service';
import { ElasticService } from '../elastic/elastic.service';

@Injectable()
export class IndexingService {
  constructor(
    private healthService: HealthService,
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async indexData() {
    await this.typesense.createCollection();
    await this.typesense.addDataToCollection();
    await this.meili.createCollection();
    await this.elastic.createCollection();
  }
}
