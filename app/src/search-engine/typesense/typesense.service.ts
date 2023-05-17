import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchEngineService } from '../search-engine.service';

@Injectable()
export class TypesenseService extends SearchEngineService {
  constructor(@Inject('Typesense') private client: Client) {
    super();
    this.engineName = 'Typesense';
  }

  protected override async createCollection(collectionName: string, data: any) {
    const booksSchema = {
      name: collectionName,
      fields: [{ name: '.*', type: 'auto' }],
    };
    await this.client
      .collections()
      .create(booksSchema as CollectionCreateSchema)
      .catch((e) => {
        console.log(e);
      });
    await this.client
      .collections(collectionName)
      .documents()
      .import(data, { action: 'create' }); //works much better with the addition of {action: 'create'}
  }

  async searchCollection(collectionName: string, query: string) {
    const searchParameters = {
      q: 'harry potter',
      query_by: 'title',
      sort_by: 'ratings_count:desc',
    };
    this.client
      .collections(collectionName)
      .documents()
      .search(searchParameters)
      .then(function (searchResults) {
        console.log(JSON.stringify(searchResults, null, 2));
      });
  }

  async retrieve(collectionName: string) {
    console.log(collectionName);
    this.client.collections(collectionName).retrieve();
  }
}
