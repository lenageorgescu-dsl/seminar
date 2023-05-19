import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
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
  index(): string {
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

  // @Get('typesense/:collection/:keyword')
  // async searchTypeSense(@Param() params: any) {
  //   return await this.searchService.searchTypeSense(
  //     params.collection,
  //     params.keyword,
  //   );
  // }
}
