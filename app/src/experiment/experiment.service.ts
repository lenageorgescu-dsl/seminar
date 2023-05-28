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
    await this.typesense.boolQuerySearch(collectionName, keyword, field, query);
    await this.typesense.boolQuerySearch(collectionName, keyword, field, query);
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
    console.log(relevantKeys);
    relevantKeys.forEach((s) => {
      const numberArr: any[] = [];
      for (let i = 0; i < matches.length; i++) {
        numberArr.push(matches[i][s]);
      }
      if (typeof numberArr[0] == 'number') res[s] = this.median(numberArr);
      else res[s] = this.medianArray(numberArr);
    });
    console.log('RESULT: ', res);
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
}
