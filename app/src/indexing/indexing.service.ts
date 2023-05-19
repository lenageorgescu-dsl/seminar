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

  public async indexTypeSense(collectionName: string) {
    const data = this.loadData(`../app/assets/data/${collectionName}.json`);
    await this.typesense.indexDocuments(collectionName, data);
    console.log('Typensense index finished: ', collectionName);
  }

  public async indexMeili(collectionName: string) {
    const data = this.loadData(`../app/assets/data/${collectionName}.json`);
    await this.meili.indexDocuments(collectionName, data);
    console.log('Meili index finished: ', collectionName);
  }

  public async indexElastic(collectionName: string) {
    const data = this.loadData(`../app/assets/data/${collectionName}.json`);
    await this.elastic.indexDocuments(collectionName, data);
    console.log('Elastic index finished: ', collectionName);
  }

  private loadData(path: string) {
    const file = readFileSync(path, 'utf-8');
    const data = JSON.parse(file);
    return data;
  }
}
