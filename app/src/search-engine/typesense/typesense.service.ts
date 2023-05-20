import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
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
    try {
      await this.client
        .collections(collectionName)
        .documents()
        .import(data, { action: 'create' }); //works much better with the addition of {action: 'create'}
    } catch (e) {
      console.log(e);
    }
  }

  private getAllKeys(collectionName: string) {
    const file = readFileSync(
      `../app/assets/data/${collectionName}.json`,
      'utf-8',
    );
    const data = JSON.parse(file)[0];
    const arr = Object.entries(data);
    const filteredArr = arr.filter(function ([key, value]) {
      return typeof value == 'string' && key != 'id';
    });
    const newObj = Object.fromEntries(filteredArr);
    const keys = Object.keys(newObj);
    return keys;
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

  public async keywordbla(collectionName: string, keyword: string) {
    const keys = this.getAllKeys(collectionName);
    const formatetKeys = this.formatFields(keys);
    const searchParams = { q: keyword, query_by: formatetKeys };
    console.log('query: ', searchParams);
    await this.client
      .collections(collectionName)
      .documents()
      .search(searchParams)
      .then(function (searchResults) {
        console.log(JSON.stringify(searchResults, null, 2));
      });
  }

  protected override async multiMatchQuery(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    const query_by: string = this.formatFields(fields);
    const searchParams = { q: keyword, query_by: query_by };
    console.log('query: ', searchParams);
    await this.client
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
