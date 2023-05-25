import { Injectable } from '@nestjs/common';
import { dockerContainers, dockerContainerStats } from 'dockerstats';
import { readFileSync, writeFileSync } from 'fs';
import { ExperimentService } from '../experiment/experiment.service';
import { promisify } from 'util';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';

export type BoolQuery = {
  and: any[];
  or: any[];
};

@Injectable()
export abstract class SearchEngineService {
  protected engineName: string;
  protected experimentNumber = 42;
  protected path = `${ExperimentService.getResultPath()}-foobar`;

  public async initialValues() {
    const data = await this.getContainerData(this.engineName);
    const storage = await this.getStorage();
    const res = JSON.stringify({
      experiment: this.experimentNumber,
      engine: this.engineName,
      operation: 'init',
      memPercent: data.memPercent,
      cpuPercent: data.cpuPercent,
      storageMega: storage,
    });
    console.log('INIT: ');
    console.log(res);

    writeFileSync(this.path, res, { flag: 'a' });
  }
  public async indexDocuments(collectionName: string) {
    try {
      const data = this.loadData(`../app/assets/data/${collectionName}.json`);
      const cpuStats: Array<number> = [];
      const memStats: Array<number> = [];
      let containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);
      const intervalId = setIntervalAsync(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 500);
      const storageBefore = await this.getStorage();
      const startTime = Date.now();
      await this.createCollection(collectionName, data);
      const endTime = Date.now();
      await clearIntervalAsync(intervalId);
      containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);
      const storageAfter = await this.getStorage();
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
        storageMega: storageAfter - storageBefore,
      });
      console.log('INDEX: ');
      console.log(res);
      writeFileSync(this.path, res, { flag: 'a' });
    } catch (e) {
      console.log(e);
    }
  }

  public async keywordSearch(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    try {
      const cpuStats: Array<number> = [];
      const memStats: Array<number> = [];
      let containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);

      const intervalId = setIntervalAsync(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 1);
      const startTime = Date.now();
      const hits = await this.multiMatchQuery(collectionName, keyword, fields);
      const endTime = Date.now();
      await clearIntervalAsync(intervalId);
      containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);

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

  public async boolQuerySearch(
    collectionName: string,
    keyword: string,
    query: BoolQuery,
  ) {
    try {
      const cpuStats: Array<number> = [];
      const memStats: Array<number> = [];
      let containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);

      const intervalId = setIntervalAsync(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 1);

      const startTime = Date.now();
      const hits = await this.boolQuery(collectionName, keyword, query);
      const endTime = Date.now();
      await clearIntervalAsync(intervalId);
      containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'boolQuerySearch',
        collection: collectionName,
        boolQuery: this.stringifyBoolQuery(query, 'AND', 'OR', ' = '),
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: memStats,
        cpuPercent: cpuStats,
      });
      console.log('FACETED SEARCH: ');
      console.log(data);
      writeFileSync(this.path, data, { flag: 'a' });
    } catch (e) {
      console.log(e);
    }
  }

  protected boolQuery(
    collectionName: string,
    keyword: string,
    query: BoolQuery,
  ) {
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
      let containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);
      const intervalId = setIntervalAsync(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
      }, 1);
      const startTime = Date.now();
      const hits = await this.placeholderQuery(collectionName);
      const endTime = Date.now();
      await clearIntervalAsync(intervalId);
      containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);

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
  private async getStorage() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exec = promisify(require('node:child_process').exec);
    const { stdout } = await exec('du -h --max-depth=1', {
      cwd: '../search-engine-volumes',
    });
    const arr: string[] = stdout.split(/\r?\n/);
    const str = arr
      .filter((element) => element.includes(this.engineName))
      .pop();
    const amount = str.split('./')[0];
    let firstPart = ~~amount.slice(0, amount.length - 2);
    const secondPart = amount.slice(amount.length - 2);
    if (secondPart.includes('K')) firstPart /= 1000;
    if (secondPart.includes('G')) firstPart *= 1000;
    return firstPart;
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

  protected stringifyBoolQuery(
    query: BoolQuery,
    and: string,
    or: string,
    equals: string,
  ): string {
    let res = '';
    for (let i = 0; i < query.and.length; i++) {
      if (res != '') {
        res += ' ';
        res += and;
        res += ' ';
      }
      const key = Object.keys(query.and[i]).pop();
      res += key;
      res += equals;
      res += query.and[i][key];
    }
    for (let i = 0; i < query.or.length; i++) {
      if (res != '') {
        res += ' ';
        res += or;
        res += ' ';
      }
      const key = Object.keys(query.or[i]).pop();
      res += key;
      res += equals;
      res += query.or[i][key];
    }
    console.log(res);
    return res;
  }

  protected getFieldsFromBoolQuery(query: BoolQuery): string[] {
    const fieldsAnd: string[] = [];
    const fieldsOr: string[] = [];
    for (let i = 0; i < query.and.length; i++) {
      const keys = Object.keys(query.and[i]).pop();
      fieldsAnd.push(keys);
    }
    for (let i = 0; i < query.or.length; i++) {
      const keys = Object.keys(query.or[i]).pop();
      fieldsOr.push(keys);
    }
    const fields = this.arrayUnique(fieldsAnd.concat(fieldsOr));
    return fields;
  }

  private arrayUnique(arr) {
    const a = arr.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
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
