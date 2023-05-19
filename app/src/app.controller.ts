import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { IndexingService } from './indexing/indexing.service';
import { SearchService } from './search/search.service';
import { dockerContainers, dockerContainerStats } from 'dockerstats';

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
    await this.dockerContainers();
    return 'foobar';
  }

  async dockerContainers() {
    console.log('gugus');
    try {
      const meili = (await dockerContainers())
        .filter((container) => container.name == 'meili')
        .pop();
      console.log(meili);
      const id = meili.id;
      const data = (await dockerContainerStats(id)).pop();
      console.log('Docker Container Stats:');
      console.log(data);
      // console.log('- ID: ' + data.id);
      // console.log('- Mem usage: ' + data.memUsage);
      // console.log('- Mem limit: ' + data.memLimit);
      // console.log('- Mem usage %: ' + data.memPercent);
      // console.log('- CPU usage %: ' + data.cpuPercent);
      // console.log('...');
    } catch (e) {
      console.log(e);
    }
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

  // @Get('typesense/:collection/:keyword')
  // async searchTypeSense(@Param() params: any) {
  //   return await this.searchService.searchTypeSense(
  //     params.collection,
  //     params.keyword,
  //   );
  // }
}
