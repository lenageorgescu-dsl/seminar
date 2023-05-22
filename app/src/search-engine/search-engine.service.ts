import { Injectable } from '@nestjs/common';
import { dockerContainers, dockerContainerStats } from 'dockerstats';
import { writeFileSync } from 'fs';

@Injectable()
export abstract class SearchEngineService {
  protected engineName: string;
  protected experimentNumber = 42;

  public async indexDocuments(collectionName: string, data: any) {
    try {
      const startTime = Date.now();
      await this.createCollection(collectionName, data);
      console.log('engine name : ' + this.engineName);
      const containerData = await this.getContainerData(this.engineName);
      const endTime = Date.now();
      const res = JSON.stringify({
        engine: this.engineName,
        operation: 'index',
        collection: collectionName,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: containerData.memPercent,
        cpuPercent: containerData.cpuPercent,
      });
      writeFileSync(
        `${this.engineName}-${collectionName}-index-${this.experimentNumber}.txt`,
        res,
      );
    } catch (e) {
      console.log(e);
    }
  }

  protected createCollection(collectionName: string, data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('foo');
      }, 5000);
    });
  }

  private async getContainerData(name: string) {
    const container = (await dockerContainers())
      .filter((container) => container.name == name)
      .pop();
    const id = container.id;
    const data = (await dockerContainerStats(id)).pop();
    return data;
  }

  public async keywordSearch(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    try {
      const startTime = Date.now();
      await this.multiMatchQuery(collectionName, keyword, fields);
      const containerData = await this.getContainerData(this.engineName);
      const endTime = Date.now();
      const data = JSON.stringify({
        engine: this.engineName,
        operation: 'keywordSearch',
        collection: collectionName,
        keyword: keyword,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: containerData.memPercent,
        cpuPercent: containerData.cpuPercent,
      });
      writeFileSync(
        `${this.engineName}-keywordSearch-${collectionName}-${keyword}.txt`,
        data,
      );
    } catch (e) {
      console.log(e);
    }
  }

  public async placeholderSearch(collectionName: string, fields: string[]) {
    try {
      const startTime = Date.now();
      await this.placeholderQuery(collectionName, fields);
      const containerData = await this.getContainerData(this.engineName);
      const endTime = Date.now();
      const data = JSON.stringify({
        engine: this.engineName,
        operation: 'keywordSearch',
        collection: collectionName,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: containerData.memPercent,
        cpuPercent: containerData.cpuPercent,
      });
      writeFileSync(
        `${this.engineName}-placeholderSearch-${collectionName}.txt`,
        data,
      );
    } catch (e) {
      console.log(e);
    }
  }

  protected placeholderQuery(collectionName: string, fields: string[]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('placeholderQuery');
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
        resolve('multimatchQuery');
      }, 5000);
    });
  }

  protected stringifyFields(fields: string[]): string {
    let res = fields[0];
    for (let i = 1; i < fields.length; i++) {
      res += ', ';
      res += fields[i];
    }
    return res;
  }
}
