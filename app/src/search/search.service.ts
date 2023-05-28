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
    await this.typesense.boolQuerySearch('tweets', 'Eisenhower', 'text', {
      and: [
        {
          text: "@Geek4MAGA @elonmusk @LegendaryEnergy @EndWokeness Don't forget Eisenhower warned us too!",
        },
      ],
    });
    await this.meili.boolQuerySearch('tweets', 'Eisenhower', 'text', {
      and: [
        {
          text: "@Geek4MAGA @elonmusk @LegendaryEnergy @EndWokeness Don't forget Eisenhower warned us too!",
        },
      ],
    });

    await this.elastic.boolQuerySearch('tweets', 'Eisenhower', 'text', {
      and: [
        {
          text: "@Geek4MAGA @elonmusk @LegendaryEnergy @EndWokeness Don't forget Eisenhower warned us too!",
        },
      ],
    });

    // await this.elastic.boolQuerySearch('tweets', 'nigeria', 'text', {
    //   and: [{ text: 'tesla' }],
    // });
  }
}
