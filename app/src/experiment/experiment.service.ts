import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HealthService } from './health/health.service';
import { MeiliService } from '../search-engine/meili/meili.service';
import { ElasticService } from '../search-engine/elastic/elastic.service';
import { TypesenseService } from '../search-engine/typesense/typesense.service';
import { readFileSync, unlink, writeFileSync } from 'fs';

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
    const data: Array<string> = [];
    for (let i = from; i <= to; i++) {
      const res = JSON.parse(
        readFileSync(
          `${ExperimentService.getResultPath()}${i}_experiment`,
          'utf-8',
        ),
      );
      data.push(res);
    }
    //TODO: compute median
  }

  public static getResultPath(): string {
    return this.resultPath;
  }
}
