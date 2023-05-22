import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import { MeiliService } from '../search-engine/meili/meili.service';

@Injectable()
export class SearchService {
  constructor(
    private typesense: TypesenseService,
    private elastic: ElasticService,
    private meili: MeiliService,
  ) {}

  public async searchData() {
    //await this.typesense.keywordbla('tweets', 'dark');
    await this.typesense.placeholderSearch('test', ['authors']);
    console.log('foo');
  }

  // public async searchTypeSense(collectionName: string, keyword: string) {
  //   await this.typesense.searchCollection(collectionName, keyword);
  // }
}
