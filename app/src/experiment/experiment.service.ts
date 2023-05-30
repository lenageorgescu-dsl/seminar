import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { readFileSync, unlink, writeFileSync } from 'fs';
import { BoolQuery } from '../search-engine/search-engine.service';

@Injectable()
export class ExperimentService implements OnApplicationBootstrap {
  private static resultPath = '../charts/src/assets/';
  constructor(
    private healthService: HealthService,
    private meili: MeiliService,
    private elastic: ElasticService,
    private typesense: TypesenseService,
  ) {}
  async onApplicationBootstrap() {
    await this.healthService.checkHealth();
  }

  public async runExperiment(version: number) {
    this.setVersion(version);
    this.setResultPath();
    this.getInitialValues();

    await this.indexAll('tweets');
    await this.placeholderSearchAll('tweets');
    await this.indexAll('articles');
    await this.placeholderSearchAll('articles');

    //KeywordSearch
    await this.keywordSearchAll('tweets', '@elonmusk good night from Nigeria', [
      'text',
    ]);
    await this.keywordSearchAll('tweets', 'Tesla', ['text']);
    await this.keywordSearchAll(
      'articles',
      '2019 Size, Share, Growth, Demand, Analysis, Research, Trends, Forecast, Applications, Products, Types, Technology, Production, Cost, Price, Profit, Leading Suppliers, Manufacturing Plants, Regions, Vendors',
      ['description'],
    );
    await this.keywordSearchAll('articles', 'Markets', ['description']);
    //BoolquerySearch
    await this.boolQuerySearchAll('tweets', 'Eisenhower', 'text', {
      and: [
        {
          text: "@Geek4MAGA @elonmusk @LegendaryEnergy @EndWokeness Don't forget Eisenhower warned us too!",
        },
      ],
    });
    await this.boolQuerySearchAll('tweets', 'Obama', 'text', {
      and: [{ text: '@MrAndyNgo @elonmusk Thanks Obama' }],
    });

    await this.boolQuerySearchAll('articles', 'year', 'description', {
      and: [
        {
          author: 'J. Bradford DeLong',
        },
        {
          author: 'Jolyjoy',
        },
      ],
    });
    await this.boolQuerySearchAll('articles', 'keynes', 'description', {
      and: [
        {
          author: 'J. Bradford DeLong',
        },
      ],
    });

    await this.parseResults(version);
    console.log('FINISHED EXPERIMENT ', version);
  }

  private async indexAll(collectionName: string) {
    await this.typesense.indexDocuments(collectionName);
    await this.meili.indexDocuments(collectionName);
    await this.elastic.indexDocuments(collectionName);
  }

  private async keywordSearchAll(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    await this.typesense.keywordSearch(collectionName, keyword, fields);
    await this.meili.keywordSearch(collectionName, keyword, fields);
    await this.elastic.keywordSearch(collectionName, keyword, fields);
  }

  private async boolQuerySearchAll(
    collectionName: string,
    keyword: string,
    field: string,
    query: BoolQuery,
  ) {
    await this.typesense.boolQuerySearch(collectionName, keyword, field, query);
    await this.meili.boolQuerySearch(collectionName, keyword, field, query);
    await this.elastic.boolQuerySearch(collectionName, keyword, field, query);
  }

  private async placeholderSearchAll(collectionName: string) {
    await this.typesense.placeholderSearch(collectionName);
    await this.meili.placeholderSearch(collectionName);
    await this.elastic.placeholderSearch(collectionName);
  }

  private async getInitialValues() {
    await this.typesense.initialValues();
    await this.meili.initialValues();
    await this.elastic.initialValues();
  }

  private setVersion(version: number) {
    this.meili.setVersion(version);
    this.elastic.setVersion(version);
    this.typesense.setVersion(version);
  }

  private setResultPath() {
    this.meili.setPath();
    this.typesense.setPath();
    this.elastic.setPath();
  }

  private async parseResults(version: number) {
    let data = readFileSync(
      `${ExperimentService.getResultPath()}${version}`,
      'utf-8',
    );
    data = '[' + data + ']';
    data = data.replaceAll('}{', '},{');
    writeFileSync(
      `${ExperimentService.getResultPath()}${version}_experiment.json`,
      data,
    );
    unlink(`${ExperimentService.getResultPath()}${version}`, (err) => {
      console.log();
    });
  }

  /**Method to aggregate several experiments */
  public compileResults(from: number, to: number) {
    const data: Array<any[]> = [];
    for (let i = from; i <= to; i++) {
      const res: any[] = JSON.parse(
        readFileSync(
          `${ExperimentService.getResultPath()}${i}_experiment.json`,
          'utf-8',
        ),
      );
      data.push(res);
    }
    const res: any[] = [];
    data[0].forEach((s) => {
      const t = this.findMatches(s, data);
      const aggregate = this.aggregateMatches(t);
      res.push(aggregate);
    });
    const title = `${from}-${to}`;
    writeFileSync(
      `${ExperimentService.getResultPath()}${title}_experiment_suite.json`,
      JSON.stringify(res),
    );
    console.log('FINISHED');
  }

  private findMatches(element: any, jsons: any[][]): any[] {
    const matches: any[] = [element];
    for (let i = 1; i < jsons.length; i++) {
      const res = jsons[i]
        .filter(
          (s) =>
            s.engine == element.engine &&
            s.operation == element.operation &&
            s.collection == element.collection &&
            s.keyword == element.keyword &&
            s.boolQuery == element.boolQuery,
        )
        .pop();
      matches.push(res);
    }
    return matches;
  }

  private aggregateMatches(matches: any[]): any {
    const res: any = matches[0];
    const relevantKeys: string[] = [];
    for (const key in matches[0]) {
      if (typeof matches[0][key] != 'string') relevantKeys.push(key);
    }
    relevantKeys.forEach((s) => {
      const numberArr: any[] = [];
      for (let i = 0; i < matches.length; i++) {
        numberArr.push(matches[i][s]);
      }
      if (typeof numberArr[0] == 'number') res[s] = this.median(numberArr);
      else res[s] = this.medianArray(numberArr);
    });
    return res;
  }

  private median(arr: number[]): number {
    arr = arr.filter((s) => s != undefined);
    if (arr.length == 0) {
      return; // 0.
    }
    arr.sort((a, b) => a - b); // 1.
    const midpoint = Math.floor(arr.length / 2); // 2.
    const median =
      arr.length % 2 === 1
        ? arr[midpoint] // 3.1. If odd length, just take midpoint
        : (arr[midpoint - 1] + arr[midpoint]) / 2; // 3.2. If even length, take median of midpoints
    return median;
  }

  private medianArray(arr: number[][]): number[] {
    const resArr: number[] = [];
    if (arr.length == 0) {
      return; // 0.
    }
    let maxLength = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length > maxLength) maxLength = arr[i].length;
    }
    for (let i = 0; i < maxLength; i++) {
      const numberArr: number[] = [];
      for (let j = 0; j < arr.length; j++) {
        numberArr.push(arr[j][i]);
      }
      const res = this.median(numberArr);
      resArr.push(res);
    }
    return resArr;
  }

  public static getResultPath(): string {
    return this.resultPath;
  }

  /**Method to get the correct x-Axis-values on the line-charts */

  public correctAxis(path: string) {
    const data: any[] = JSON.parse(
      readFileSync(`${ExperimentService.getResultPath()}${path}.json`, 'utf-8'),
    );
    const rest: any[] = data.filter((s) => s.operation == 'init');
    const total: any[] = [];
    const indexData = this.correctOperatorAxis(data, 'index', 500);
    const placeholderData = this.correctOperatorAxis(
      data,
      'placeholderSearch',
      10,
    );
    const keywordData = this.correctOperatorAxis(data, 'keywordSearch', 10);
    const boolqueryData = this.correctOperatorAxis(data, 'boolQuerySearch', 10);
    placeholderData.forEach((s) => total.push(s));
    boolqueryData.forEach((s) => total.push(s));
    keywordData.forEach((s) => total.push(s));
    indexData.forEach((s) => total.push(s));
    rest.forEach((s) => total.push(s));
    writeFileSync(
      `${ExperimentService.getResultPath()}${path}_axis.json`,
      JSON.stringify(total),
    );
  }

  private correctOperatorAxis(
    input: any[],
    operation: string,
    difference: number,
  ) {
    const data: any[] = input.filter((s) => s.operation == operation);
    const sorted: any[] = [];
    let minValue = 10000000;
    let maxValue = 0;
    data.forEach((s) => {
      const fullData = s;
      const cpuTime = s.cpuTime;
      for (let i = 0; i < s.cpuTime.length; i++) {
        cpuTime[i] = this.roundNumber(cpuTime[i], difference);
      }
      const res: TimeStats = this.iterateAndAggregate(
        cpuTime,
        s.cpuPercent,
        s.memPercent,
        0,
      );
      this.sort(res);
      fullData.cpuTime = res.cpuTime;
      fullData.cpuPercent = res.cpuPercent;
      fullData.memPercent = res.memPercent;
      sorted.push(fullData);
      const lastIndex = res.cpuTime.length - 1;
      if (res.cpuTime[0] < minValue) minValue = res.cpuTime[0];
      if (res.cpuTime[lastIndex] > maxValue) maxValue = res.cpuTime[lastIndex];
    });
    const finalData: any[] = [];
    sorted.forEach((t) => {
      const result = t;
      const relevantData = {
        cpuPercent: t.cpuPercent,
        memPercent: t.memPercent,
        cpuTime: t.cpuTime,
      };
      const res: TimeStats = this.fillGaps(
        relevantData,
        minValue,
        maxValue,
        difference,
      );
      result.cpuPercent = res.cpuPercent;
      result.memPercent = res.memPercent;
      result.cpuTime = res.cpuTime;

      finalData.push(result);
    });
    return finalData;
  }

  private roundNumber(num: number, difference: number) {
    return Math.round(num / difference) * difference;
  }

  private iterateAndAggregate(
    timeArr: number[],
    cpuArr: number[],
    memArr: number[],
    index: number,
  ): TimeStats {
    if (index == timeArr.length) {
      const res: TimeStats = {
        cpuTime: timeArr,
        cpuPercent: cpuArr,
        memPercent: memArr,
      };
      return res;
    }

    const time = timeArr[index];
    let lastIncludedIndex = index;
    for (let i = index; i < timeArr.length; i++) {
      if (time == timeArr[i]) lastIncludedIndex = i;
      else break;
    }
    return this.aggregate(timeArr, cpuArr, memArr, index, lastIncludedIndex);
  }

  private aggregate(
    timeArr: number[],
    cpuArr: number[],
    memArr: number[],
    index: number,
    lastIncludedIndex: number,
  ) {
    const cpuPart = cpuArr.slice(index, lastIncludedIndex + 1);
    const cpuMedian = this.median(cpuPart);
    const memPart = memArr.slice(index, lastIncludedIndex + 1);
    const memMedian = this.median(memPart);
    timeArr.splice(index + 1, lastIncludedIndex - index);
    cpuArr.splice(index + 1, lastIncludedIndex - index);
    memArr.splice(index + 1, lastIncludedIndex - index);
    cpuArr[index] = cpuMedian;
    memArr[index] = memMedian;
    return this.iterateAndAggregate(timeArr, cpuArr, memArr, index + 1);
  }

  private sort(stats: TimeStats): TimeStats {
    const arr = this.bundleStats(stats);
    arr.sort((a, b) => (a.cpuTime > b.cpuTime ? 1 : -1));
    const res = this.unbundleStats(arr);
    return res;
  }

  private bundleStats(stats: TimeStats) {
    const arr = [];
    for (let i = 0; i < stats.cpuPercent.length; i++) {
      const element = {
        cpuTime: stats.cpuTime[i],
        cpuPercent: stats.cpuPercent[i],
        memPercent: stats.memPercent[i],
      };
      arr.push(element);
    }
    return arr;
  }

  private unbundleStats(arr: any[]): TimeStats {
    const res: TimeStats = { cpuPercent: [], cpuTime: [], memPercent: [] };
    arr.forEach((t) => {
      res.cpuPercent.push(t.cpuPercent);
      res.cpuTime.push(t.cpuTime);
      res.memPercent.push(t.memPercent);
    });
    return res;
  }

  private fillGaps(
    stats: TimeStats,
    min: number,
    max: number,
    difference: number,
  ): TimeStats {
    const timearr = [];
    for (let i = min; i <= max; i += difference) {
      const res = { cpuTime: i, cpuPercent: null, memPercent: null };
      timearr.push(res);
    }
    const arr = this.bundleStats(stats);
    for (let i = 0; i < timearr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (timearr[i].cpuTime == arr[j].cpuTime) {
          timearr[i].cpuPercent = arr[j].cpuPercent;
          timearr[i].memPercent = arr[j].memPercent;
        }
      }
    }
    const filled = this.fillAllGaps(timearr);
    const res = this.unbundleStats(filled);
    return res;
  }

  private fillAllGaps(arr: any[]) {
    let firstIndex;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].cpuPercent != null) {
        firstIndex = i; //Get first index
        break;
      }
    }
    let lastIndex;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].cpuPercent != null) lastIndex = i; //Get last index
    }
    for (let i = 0; i <= firstIndex; i++) {
      arr[i].cpuPercent = arr[firstIndex].cpuPercent; //Set first values
      arr[i].memPercent = arr[firstIndex].memPercent;
    }
    for (let i = lastIndex; i < arr.length; i++) {
      arr[i].cpuPercent = arr[lastIndex].cpuPercent; //Set last values
      arr[i].memPercent = arr[lastIndex].memPercent;
    }
    let lastValidCpu = arr[firstIndex].cpuPercent; //Set in between values
    let lastValidMem = arr[firstIndex].cpuPercent;

    for (let i = firstIndex; i < arr.length; i++) {
      //Diese Funktion könnte bei Bedarf noch glätter gemacht werden
      if (arr[i].cpuPercent == null) {
        arr[i].cpuPercent = lastValidCpu;
        arr[i].memPercent = lastValidMem;
      } else {
        lastValidCpu = arr[i].cpuPercent;
        lastValidMem = arr[i].memPercent;
      }
    }
    return arr;
  }
}

export type TimeStats = {
  cpuTime: number[];
  cpuPercent: number[];
  memPercent: number[];
};
