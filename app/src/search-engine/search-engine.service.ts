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
}
