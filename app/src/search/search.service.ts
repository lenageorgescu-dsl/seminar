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
    //await this.typesense.placeholderSearch('test');
    // await this.typesense.keywordSearch(
    //   'tweets',
    //   '@elonmusk good night from Nigeria',
    //   ['text'],
    // );
    // await this.meili.keywordSearch(
    //   'tweets',
    //   '@elonmusk good night from Nigeria',
    //   ['text'],
    // );
    // await this.elastic.keywordSearch(
    //   'tweets',
    //   '@elonmusk good night from Nigeria',
    //   ['text'],
    // );
    await this.elastic.placeholderSearch('tweets');

    // await this.meili.boolQuerySearch('tweets', '', {
    //   and: [{ text: 'run for president' }, { text: '2028' }],
    //   or: [],
    // });
  }
}
