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
    const schema = {
      name: collectionName,
      fields: [{ name: '.*', type: 'auto' }],
    };
    await this.client
      .collections()
      .create(schema as CollectionCreateSchema)
      .catch((e) => {
        console.log(e);
      });
    await this.client
      .collections(collectionName)
      .documents()
      .import(data, { action: 'create' }); //works much better with the addition of {action: 'create'}
  }

  // async searchCollection(collectionName: string, query: string) {
  //   const searchParameters = {
  //     q: 'the',
  //     query_by: 'authors, title',
  //     // sort_by: 'ratings_count:desc',
  //   };
  //   this.client
  //     .collections(collectionName)
  //     .documents()
  //     .search(searchParameters)
  //     .then(function (searchResults) {
  //       console.log(JSON.stringify(searchResults, null, 2));
  //     });
  // }

  protected override async searchKeyWords(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    const query_by: string = this.formatFields(fields);
    const searchParams = { q: keyword, query_by: query_by };
    this.client
      .collections(collectionName)
      .documents()
      .search(searchParams)
      .then(function (searchResults) {
        console.log(JSON.stringify(searchResults, null, 2));
      });
  }

  private formatFields(fields: string[]): string {
    let res = fields[0];
    for (let i = 1; i < fields.length; i++) {
      res += ', ';
      res += fields[i];
    }
    return res;
  }
}
