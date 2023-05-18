import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { IndexingService } from '../indexing/indexing.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class ExperimentService implements OnApplicationBootstrap {
  constructor(
    private healthService: HealthService,
    private indexService: IndexingService,
    private searchService: SearchService,
  ) {}
  async onApplicationBootstrap() {
    await this.healthService.checkHealth();
    await this.indexService.indexData();
    //await this.searchService.searchData();
  }
}
