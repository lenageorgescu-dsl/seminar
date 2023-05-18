import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class SearchEngineService {
  protected engineName: string;

  public async indexDocuments(
    collectionName: string,
    data: any,
    resultFilename: string,
  ) {
    const startTime = Date.now();
    await this.createCollection(collectionName, data);
    const endTime = Date.now();
    console.log({
      engine: this.engineName,
      operation: 'index',
      startTime,
      endTime,
      running: endTime - startTime,
    });
  }

  protected createCollection(collectionName: string, data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('foo');
      }, 5000);
    });
  }

  public async keywordSearch(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    const startTime = Date.now();
    await this.searchKeyWords(collectionName, keyword, fields);
    const endTime = Date.now();
    console.log({
      engine: this.engineName,
      operation: 'keywordSearch',
      startTime,
      endTime,
      running: endTime - startTime,
    });
  }

  public placeholderSearch() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('bar');
      }, 5000);
    });
  }

  // public federatedSearch() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve('baz');
  //     }, 5000);
  //   });
  // }

  protected searchKeyWords(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('keywordSearch');
      }, 5000);
    });
  }
}
