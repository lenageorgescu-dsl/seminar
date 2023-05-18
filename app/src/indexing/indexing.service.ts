import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';

@Injectable()
export class IndexingService {
  constructor(
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async indexData() {
    //const musk = this.loadData('../app/assets/testdata/books.jsonl');
    const test = this.loadData('../app/assets/data/set2.json');
    await this.typesense.indexDocuments('test', test);
    console.log('finished');
    //await this.meili.indexDocuments('foo', elon, 'bar');
    //await this.elastic.indexDocuments('foo', elon, 'bar');
  }

  private loadData(path: string) {
    const file = readFileSync(path, 'utf-8');
    const data = JSON.parse(file);
    return data;
  }
}
