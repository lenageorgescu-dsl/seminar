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
