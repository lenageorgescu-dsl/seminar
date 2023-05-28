import { Injectable } from '@nestjs/common';
import { dockerContainers, dockerContainerStats } from 'dockerstats';
import { readFileSync, writeFileSync } from 'fs';
import { ExperimentService } from '../experiment/experiment.service';
import { promisify } from 'util';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';

export type BoolQuery = {
  and: any[];
};

export type cpuStats = {
  cpu: Array<number>;
  mem: Array<number>;
  cpuTime: Array<number>;
  intervalId: any;
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
      const timeStats: Array<number> = [];
      const cpuStart = Date.now();
      let containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);
      timeStats.push(Date.now() - cpuStart);
      const intervalId = setIntervalAsync(async () => {
        const data = await this.getContainerData(this.engineName);
        cpuStats.push(data.cpuPercent);
        memStats.push(data.memPercent);
        timeStats.push(Date.now() - cpuStart);
      }, 500);
      const storageBefore = await this.getStorage();
      const startTime = Date.now();
      await this.createCollection(collectionName, data);
      const endTime = Date.now();
      await clearIntervalAsync(intervalId);
      containerData = await this.getContainerData(this.engineName);
      cpuStats.push(containerData.cpuPercent);
      memStats.push(containerData.memPercent);
      timeStats.push(Date.now() - cpuStart);
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
        cpuTime: timeStats,
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
      const intervalStats = await this.setUpInterval(1);
      const startTime = Date.now();
      const hits = await this.multiMatchQuery(collectionName, keyword, fields);
      const endTime = Date.now();
      await this.tearDownInterval(intervalStats.intervalId);
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
        memPercent: intervalStats.mem,
        cpuPercent: intervalStats.cpu,
        cpuTime: intervalStats.cpuTime,
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
    field: string,
    query: BoolQuery,
  ) {
    try {
      const intervalStats = await this.setUpInterval(1);
      const startTime = Date.now();
      const hits = await this.boolQuery(collectionName, keyword, field, query);
      const endTime = Date.now();
      await this.tearDownInterval(intervalStats.intervalId);
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'boolQuerySearch',
        collection: collectionName,
        boolQuery: `Keyword: ${keyword}, Conditions: ${this.stringifyBoolQuery(
          query,
          'AND',
          ' != ',
          true,
        )}`,
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: intervalStats.mem,
        cpuPercent: intervalStats.cpu,
        cpuTime: intervalStats.cpuTime,
      });
      console.log('BOOLQUERY SEARCH: ');
      console.log(data);
      writeFileSync(this.path, data, { flag: 'a' });
    } catch (e) {
      console.log(e);
    }
  }

  public async placeholderSearch(collectionName: string) {
    try {
      const intervalStats = await this.setUpInterval(1);
      const startTime = Date.now();
      const hits = await this.placeholderQuery(collectionName);
      const endTime = Date.now();
      await this.tearDownInterval(intervalStats.intervalId);
      const data = JSON.stringify({
        experiment: this.experimentNumber,
        engine: this.engineName,
        operation: 'placeholderSearch',
        collection: collectionName,
        hits: hits,
        startTime,
        endTime,
        running: endTime - startTime,
        memPercent: intervalStats.mem,
        cpuPercent: intervalStats.cpu,
        cpuTime: intervalStats.cpuTime,
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

  protected boolQuery(
    collectionName: string,
    keyword: string,
    field: string,
    query: BoolQuery,
  ) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('boolQuery');
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
    equals: string,
    quotationMark: boolean,
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
      let word = query.and[i][key];
      if (quotationMark && this.hasWhiteSpace(word)) word = '"' + word + '"'; //TODO: make this more concrete
      res += word;
    }
    console.log(res);
    return res;
  }

  private hasWhiteSpace(s: string): boolean {
    return /\s/g.test(s);
  }

  protected getFieldsFromBoolQuery(query: BoolQuery): string[] {
    const fieldsAnd: string[] = [];
    for (let i = 0; i < query.and.length; i++) {
      const keys = Object.keys(query.and[i]).pop();
      fieldsAnd.push(keys);
    }
    const fields = this.arrayUnique(fieldsAnd);
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

  private async setUpInterval(interval: number): Promise<cpuStats> {
    const cpuStats: Array<number> = [];
    const memStats: Array<number> = [];
    const timeStats: Array<number> = [];
    const start = Date.now();
    const intervalId = setInterval(async () => {
      const data = await this.getContainerData(this.engineName);
      const timeNow = Date.now();
      cpuStats.push(data.cpuPercent);
      memStats.push(data.memPercent);
      timeStats.push(timeNow - start);
    }, 5);
    await this.sleep();
    return {
      cpu: cpuStats,
      mem: memStats,
      cpuTime: timeStats,
      intervalId: intervalId,
    };
  }

  private async tearDownInterval(intervalId: any): Promise<void> {
    clearInterval(intervalId);
    await this.sleep();
  }

  private async sleep() {
    await new Promise((r) => setTimeout(r, 2100));
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
