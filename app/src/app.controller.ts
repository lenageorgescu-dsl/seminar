import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ExperimentService } from './experiment/experiment.service';
import { ElasticService } from './search-engine/elastic/elastic.service';
import { MeiliService } from './search-engine/meili/meili.service';
import { TypesenseService } from './search-engine/typesense/typesense.service';
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
  constructor(
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}

  @Get()
  async index(): Promise<string> {
    return 'foobar';
  }

  @Get('typesense/:collectionName')
  async indexTypesense(@Param('collectionName') name: string): Promise<string> {
    await this.typesense.indexDocuments(name);
    return 'Index Typesense Controller finished';
  }

  @Get('meili/:collectionName')
  async indexMeili(@Param('collectionName') name: string): Promise<string> {
    await this.meili.indexDocuments(name);
    return 'Index Meili Controller finished';
  }

  @Get('elastic/:collectionName')
  async indexElastic(@Param('collectionName') name: string): Promise<string> {
    await this.elastic.indexDocuments(name);
    return 'Index Elastic Controller finished';
  }

  @Get('all/:collectionName')
  async indexAll(@Param('collectionName') name: string): Promise<string> {
    await this.typesense.indexDocuments(name);
    await this.meili.indexDocuments(name);
    await this.elastic.indexDocuments(name);
    return 'All engines finished indexing ';
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

  @Get(':from/:to')
  compileResults(@Param('from') from: number, @Param('to') to: number) {
    this.experiment.compileResults(from, to);
    return 'Compiling results finished';
  }
}
