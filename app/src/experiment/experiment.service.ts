import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class ExperimentService implements OnApplicationBootstrap {
  constructor(
    private healthService: HealthService,
    private searchService: SearchService,
  ) {}
  async onApplicationBootstrap() {
    await this.healthService.checkHealth();
  }

  async runExperiment(version: number) {
    console.log('running experiment');
  }
}
