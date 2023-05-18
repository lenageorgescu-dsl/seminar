import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import testdata from 'assets/testdata/test.json';

@Injectable()
export class IndexingService {
  constructor(
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async indexData() {
    await this.typesense.indexDocuments('foo', testdata, 'bar');
    await this.meili.indexDocuments('foo', testdata, 'bar');
    await this.elastic.indexDocuments('foo', testdata, 'bar');
  }
}
