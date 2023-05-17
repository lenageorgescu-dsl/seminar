import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../typesense/typesense.service';
import { MeiliService } from '../meili/meili.service';
import { ElasticService } from '../elastic/elastic.service';
import { readFile } from 'fs/promises';

@Injectable()
export class IndexingService {
  constructor(
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async indexData() {
    const data = await (
      await readFile('../app/assets/testdata/books.jsonl')
    ).toString();
    if (data == undefined) throw new Error('File not found');

    await this.typesense.createCollection('foo', data);
    console.log('here');
    await this.typesense.retrieve('foo');
    console.log('end');
    //await this.meili.createCollection();
    //await this.elastic.createCollection();
  }
}
