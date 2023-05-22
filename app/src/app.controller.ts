import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ExperimentService } from './experiment/experiment.service';
import { IndexingService } from './indexing/indexing.service';
import { SearchService } from './search/search.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('index')
export class IndexController {
  constructor(private readonly service: IndexingService) {}

  @Get()
  async index(): Promise<string> {
    return 'foobar';
  }

  @Get('typesense/:collectionName')
  async indexTypesense(@Param('collectionName') name: string): Promise<string> {
    await this.service.indexTypeSense(name);
    return 'Index Typesense Controller finished';
  }

  @Get('meili/:collectionName')
  async indexMeili(@Param('collectionName') name: string): Promise<string> {
    await this.service.indexMeili(name);
    return 'Index Meili Controller finished';
  }

  @Get('elastic/:collectionName')
  async indexElastic(@Param('collectionName') name: string): Promise<string> {
    await this.service.indexElastic(name);
    return 'Index Elastic Controller finished';
  }
}

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search() {
    return this.searchService.searchData();
  }
}

@Controller('experiment')
export class ExperimentController {
  constructor(private readonly experiment: ExperimentService) {}

  @Get(':version')
  async run(@Param('version') version: number) {
    await this.experiment.runExperiment(version);
    return 'Experiment Controller finished';
  }
}
