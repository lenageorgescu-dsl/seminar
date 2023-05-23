import { Injectable } from '@nestjs/common';
import { dockerContainers, dockerContainerStats } from 'dockerstats';
import { readFileSync, writeFileSync } from 'fs';
import { ExperimentService } from '../experiment/experiment.service';
import { cpus } from 'os';

export type BoolQuery = {
  and: string[];
  or: string[];
};

@Injectable()
export abstract class SearchEngineService {
  protected engineName: string;
  protected experimentNumber = 42;
  protected path = 'foobar';

  public async indexDocuments(collectionName: string) {
    try {
      const data = this.loadData(`../app/assets/data/${collectionName}.json`);
      const cpuStats: Array<number> = [];
      const memStats: Array<number> = [];
      const intervalId = setInterval(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 1000);
      const startTime = Date.now();
      await this.createCollection(collectionName, data);
      const endTime = Date.now();
      clearInterval(intervalId);
      const res = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'index',
        collection: collectionName,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: memStats,
        cpuPercent: cpuStats,
      });
      console.log('INDEX: ');
      console.log(res);
      writeFileSync(this.path, res, { flag: 'a' });
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
      const cpuStats: Array<number> = [];
      const memStats: Array<number> = [];
      const intervalId = setInterval(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 1000);
      const startTime = Date.now();
      const hits = await this.multiMatchQuery(collectionName, keyword, fields);
      const endTime = Date.now();
      clearInterval(intervalId);
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'keywordSearch',
        collection: collectionName,
        keyword: keyword,
        fields: fields,
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: memStats,
        cpuPercent: cpuStats,
      });
      console.log('KEYWORDSEARCH: ');
      console.log(data);
      writeFileSync(this.path, data, { flag: 'a' });
    } catch (e) {
      console.log(e);
    }
  }

  public async boolQuerySearch(collectionName: string, query: BoolQuery) {
    try {
      const cpuStats: Array<number> = [];
      const memStats: Array<number> = [];
      const intervalId = setInterval(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 1000);
      const startTime = Date.now();
      const hits = await this.boolQuery(collectionName, query);
      const endTime = Date.now();
      clearInterval(intervalId);
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'placeholderSearch',
        collection: collectionName,
        boolQuery: query,
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: memStats,
        cpuPercent: cpuStats,
      });
      console.log('KEYWORDSEARCH: ');
      console.log(data);
      writeFileSync(this.path, data, { flag: 'a' });
    } catch (e) {
      console.log(e);
    }
  }

  protected boolQuery(collectionName: string, query: BoolQuery) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('boolQuery');
      }, 5000);
    });
  }

  public async placeholderSearch(collectionName: string) {
    try {
      const cpuStats: Array<number> = [];
      const memStats: Array<number> = [];
      const intervalId = setInterval(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 1000);

      const startTime = Date.now();
      const hits = await this.placeholderQuery(collectionName);
      const endTime = Date.now();
      clearInterval(intervalId);
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'placeholderSearch',
        collection: collectionName,
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: memStats,
        cpuPercent: cpuStats,
      });
      console.log('PLACEHOLDERSEARCH: ');
      console.log(data);
      writeFileSync(this.path, data, { flag: 'a' });
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

  public setPath() {
    this.path = `${ExperimentService.getResultPath()}${this.experimentNumber}`;
  }
}
