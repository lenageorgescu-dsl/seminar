import { Inject, Injectable } from '@nestjs/common';
import MeiliSearch from 'meilisearch';
import { SearchEngineService } from '../search-engine.service';

@Injectable()
export class MeiliService extends SearchEngineService {
  constructor(@Inject('MeiliSearch') private client: MeiliSearch) {
    super();
    this.engineName = 'Meili';
  }

  protected override async createCollection(collectionName: string, data: any) {
    try {
      await this.client
        .index(collectionName)
        .addDocuments(data)
        .then((res) => console.log(res));
    } catch (e) {
      console.log(e);
    }
  }

  async searchCollection(collectionName: string, query: string) {
    await this.client
      .index(collectionName)
      .search('Great')
      .then((res) => console.log(res));
  }
}
