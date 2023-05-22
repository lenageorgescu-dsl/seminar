import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchEngineService } from '../search-engine.service';

@Injectable()
export class TypesenseService extends SearchEngineService {
  constructor(@Inject('Typesense') private client: Client) {
    super();
    this.engineName = 'typesense';
  }

  protected override async createCollection(collectionName: string, data: any) {
    const schema = {
      name: collectionName,
      fields: [{ name: '.*', type: 'auto' }],
    };
    await this.client.collections().create(schema as CollectionCreateSchema);
    await this.client
      .collections(collectionName)
      .documents()
      .import(data, { action: 'create' }); //works much better with the addition of {action: 'create'}
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
    const formatetKeys = this.stringifyFields(keys);
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

  protected override async placeholderQuery(collectionName: string) {
    const keys = this.getAllKeys(collectionName);
    const formatetKeys = this.stringifyFields(keys);
    const searchParams = { q: '', query_by: formatetKeys };
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
    const query_by: string = this.stringifyFields(fields);
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
}
