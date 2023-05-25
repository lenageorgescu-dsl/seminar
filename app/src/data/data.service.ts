import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ExperimentService } from '../experiment/experiment.service';
import { StorageStats } from '../interfaces';

@Injectable()
export class DataService {
  parseData(version: number) {
    const data = JSON.parse(
      readFileSync(
        `${ExperimentService.getResultPath()}${version}_experiment.json`,
        'utf-8',
      ),
    );
    this.storageStats(data);
    //console.log(data);
  }

  private storageStats(data: any[]): StorageStats {
    console.log(data);
    //console.log(data);
    // const res = data.map((s) => {
    //   [s.engine, s.operation];
    // });
    // console.log(res);
    return 'foo' as unknown as StorageStats;
  }

  private getEngine(name: string, data: any) {
    const res = data.filter((element) => {
      return element.engine == name;
    });
    return res;
  }

  private getOperation(name: string, data: any) {
    const res = data.filter((element) => {
      return element.operation == name;
    });
    return res;
  }

  private getCollection(name: string, data: any) {
    const res = data.filter((element) => {
      return element.collection == name;
    });
    return res;
  }

  private filterInit(engine: string, operation: string, data: any) {
    const res = data.filter((element) => {
      return element.engine == engine && element.operation == operation;
    });
    return res.pop();
  }

  private filterCollection(
    engine: string,
    operation: string,
    collection: string,
    data: any,
  ) {
    const res = data.filter((element) => {
      return (
        element.engine == engine &&
        element.operation == operation &&
        element.collection == collection
      );
    });
    return res.pop();
  }
}
