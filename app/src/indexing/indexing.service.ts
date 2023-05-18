import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import { readFileSync } from 'fs';

@Injectable()
export class IndexingService {
  constructor(
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async indexData() {
    const test = this.loadData('../app/assets/data/test.json');

    const musk = this.loadData('../app/assets/data/musk.json');
    // await this.meili.indexDocuments('musk', musk);
    await this.elastic.indexDocuments('musk', musk);
    console.log('finished indexing musk');
    // await this.elastic.indexDocuments('test', test);
    // console.log('finished indexing test');
    //await this.meili.indexDocuments('foo', elon, 'bar');
    //await this.elastic.indexDocuments('foo', elon, 'bar');
  }

  private loadData(path: string) {
    const file = readFileSync(path, 'utf-8');
    const data = JSON.parse(file);
    return data;
  }
}
