import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import { readFile } from 'fs/promises';

@Injectable()
export class IndexingService {
  constructor(
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async indexData() {
    const data = await this.loadData('../app/assets/testdata/books.jsonl');
    await this.typesense.indexDocuments('foo', data, 'bar');
    //await this.meili.createCollection();
    //await this.elastic.createCollection();
  }

  private async loadData(path: string) {
    const data = await (
      await readFile('../app/assets/testdata/books.jsonl')
    ).toString();
    if (data == undefined) throw new Error('File not found');
    return data;
  }
}
