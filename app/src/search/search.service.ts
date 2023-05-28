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
    // await this.elastic.boolQuerySearch('tweets', '', {
    //   and: [{ text: 'run for president' }, { text: '2028' }],
    //   or: [],
    // });
    // await this.elastic.boolQuerySearch('tweets', 'president', {
    //   and: [],
    // });
    await this.elastic.boolQuerySearch('tweets', 'Food', 'text', {
      and: [{ text: '@elonmusk No fast food?' }],
    });
    // await this.typesense.boolQuerySearch('tweets', 'food', 'text', {
    //   and: [{ text: '@elonmusk No fast food?' }],
    // });
    // await this.meili.boolQuerySearch('tweets', 'food', 'text', {
    //   and: [{ text: '@elonmusk No fast food?' }],
    // });
    // await this.elastic.boolQuerySearch('tweets', 'nigeria', 'text', {
    //   and: [{ text: 'tesla' }],
    // });
  }
}
