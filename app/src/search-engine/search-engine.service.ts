import { Injectable } from '@nestjs/common';
import { dockerContainers, dockerContainerStats } from 'dockerstats';
import { readFileSync, writeFileSync } from 'fs';

@Injectable()
export abstract class SearchEngineService {
  protected engineName: string;
  protected experimentNumber = 42;

  public async indexDocuments(collectionName: string) {
    try {
      const data = this.loadData(`../app/assets/data/${collectionName}.json`);
      const startTime = Date.now();
      await this.createCollection(collectionName, data);
      const containerData = await this.getContainerData(this.engineName);
      const endTime = Date.now();
      const res = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'index',
        collection: collectionName,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: containerData.memPercent,
        cpuPercent: containerData.cpuPercent,
      });
      console.log('INDEX: ');
      console.log(res);
      writeFileSync(
        `results/${this.experimentNumber}-${this.engineName}-index-${collectionName}-.txt`,
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
      const hits = await this.multiMatchQuery(collectionName, keyword, fields);
      const containerData = await this.getContainerData(this.engineName);
      const endTime = Date.now();
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'keywordSearch',
        collection: collectionName,
        keyword: keyword,
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: containerData.memPercent,
        cpuPercent: containerData.cpuPercent,
      });
      console.log('KEYWORDSEARCH: ');
      console.log(data);
      writeFileSync(
        `results/${this.experimentNumber}-${this.engineName}-keywordSearch-${collectionName}-${keyword}.txt`,
        data,
      );
    } catch (e) {
      console.log(e);
    }
  }

  public async placeholderSearch(collectionName: string) {
    try {
      const startTime = Date.now();
      const hits = await this.placeholderQuery(collectionName);
      const containerData = await this.getContainerData(this.engineName);
      const endTime = Date.now();
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'placeholderSearch',
        collection: collectionName,
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: containerData.memPercent,
        cpuPercent: containerData.cpuPercent,
      });
      console.log('PLACEHOLDERSEARCH: ');
      console.log(data);
      writeFileSync(
        `results/${this.experimentNumber}-${this.engineName}-placeholderSearch-${collectionName}.txt`,
        data,
      );
    } catch (e) {
      console.log(e);
    }
  }

  protected placeholderQuery(collectionName: string) {
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

  private loadData(path: string) {
    const file = readFileSync(path, 'utf-8');
    const data = JSON.parse(file);
    return data;
  }

  public setVersion(version: number) {
    this.experimentNumber = version;
  }
}
