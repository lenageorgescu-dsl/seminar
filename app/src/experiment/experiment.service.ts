import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import { TypesenseService } from '../search-engine/typesense/typesense.service';

@Injectable()
export class ExperimentService implements OnApplicationBootstrap {
  constructor(
    private healthService: HealthService,
    private meili: MeiliService,
    private elastic: ElasticService,
    private typesense: TypesenseService,
  ) {}
  async onApplicationBootstrap() {
    await this.healthService.checkHealth();
  }

  async runExperiment(version: number) {
    console.log('running experiment');
    this.meili.setVersion(version);
    this.elastic.setVersion(version);
    this.typesense.setVersion(version);
    await this.meili.placeholderSearch('test');
    await this.elastic.placeholderSearch('test');
    await this.typesense.placeholderSearch('test');
  }
}
