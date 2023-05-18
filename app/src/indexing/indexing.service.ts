import { Injectable } from '@nestjs/common';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import testdata from 'assets/testdata/test.json';
import { readFileSync } from 'fs';

@Injectable()
export class IndexingService {
  constructor(
    private typesense: TypesenseService,
    private meili: MeiliService,
    private elastic: ElasticService,
  ) {}
  async indexData() {
    const elon = this.loadData('../app/assets/testdata/test.json');
    console.log(elon);
    //await this.typesense.indexDocuments('foo', elon, 'bar');
    //await this.meili.indexDocuments('foo', elon, 'bar');
    //await this.elastic.indexDocuments('foo', elon, 'bar');
  }

  async indexTypeSense(collectionName: string) {
    const data = this.loadData(`../app/assets/testdata/${collectionName}.json`);
    await this.typesense.indexDocuments(collectionName, data, 'file.txt');
  }

  private loadData(path: string) {
    const file = readFileSync(path, 'utf-8');
    const data = JSON.parse(file);
    return data;
  }
}
