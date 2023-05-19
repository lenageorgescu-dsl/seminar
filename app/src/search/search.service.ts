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
    // await this.typesense.keywordSearch('musk', 'rowling', ['text']);
    // console.log('typesense search');
    await this.meili.searchCollection('set2', 'JolyJoy');
    console.log('meili search');
    // await this.elastic.searchCollection('musk', 'rowling');
    // console.log('elastic search');
  }

  // public async searchTypeSense(collectionName: string, keyword: string) {
  //   await this.typesense.searchCollection(collectionName, keyword);
  // }
}
