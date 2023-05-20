import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';

@Injectable()
export abstract class SearchEngineService {
  protected engineName: string;
  protected experimentNumber = 42;

  public async indexDocuments(collectionName: string, data: any) {
    const startTime = Date.now();
    await this.createCollection(collectionName, data);
    const endTime = Date.now();
    const res = JSON.stringify({
      engine: this.engineName,
      operation: 'index',
      collection: collectionName,
      startTime,
      endTime,
      running: endTime - startTime,
    });
    writeFileSync(
      `${this.engineName}-${collectionName}-index-${this.experimentNumber}.txt`,
      res,
    );
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
    await this.multiMatchQuery(collectionName, keyword, fields);
    const endTime = Date.now();
    const data = JSON.stringify({
      engine: this.engineName,
      operation: 'keywordSearch',
      collection: collectionName,
      keyword: keyword,
      startTime,
      endTime,
      running: endTime - startTime,
    });
    writeFileSync(
      `${this.engineName}-keywordSearch-${collectionName}-${keyword}.txt`,
      data,
    );
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

  protected placeholderQuery(collectionName: string, fields: string[]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('keywordSearch');
      }, 5000);
    });
  }
  protected multiMatchQuery(
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
