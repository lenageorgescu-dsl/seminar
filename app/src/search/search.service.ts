import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../typesense/typesense.service';
import { ElasticService } from '../elastic/elastic.service';
import { MeiliService } from '../meili/meili.service';

@Injectable()
export class SearchService {
  constructor(
    private typesense: TypesenseService,
    private elastic: ElasticService,
    private meili: MeiliService,
  ) {}

  public async searchData() {
    await this.meili.searchCollection();
    await this.typesense.searchCollection();
    await this.elastic.searchCollection();
  }
}
