import { Inject, Injectable } from '@nestjs/common';
import MeiliSearch, { Task, TasksResults } from 'meilisearch';
import { SearchEngineService } from '../search-engine.service';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';

@Injectable()
export class MeiliService extends SearchEngineService {
  constructor(@Inject('MeiliSearch') private client: MeiliSearch) {
    super();
    this.engineName = 'Meili';
  }

  protected override async createCollection(collectionName: string, data: any) {
    console.log('collectionName: ', collectionName);
    const res = (await this.client.getTasks({ indexUids: [] })).results.filter(
      (task) => task.indexUid == collectionName,
    ); //getTasks({indexUids: ['xy']}) doesn't work
    console.log('Tasks first: ', res);
    if (res.length > 0 && !this.allTasksFailed(res)) {
      //if task already exists and those tasks haven't all failed, don't create new task
      console.log(
        'Task ' + collectionName + ' already exists, will not be indexed again',
      );
      return;
    }
    await this.client
      .index(collectionName)
      .addDocuments(data)
      .then((res) => {
        console.log(res);
      });
    const id = (await this.client.getTasks({ indexUids: [] })).results
      .filter((task) => task.indexUid == collectionName)
      .pop().uid; //getTasks({indexUids: ['xy']}) doesn't work
    await this.checkStatus(id);
  }

  // async searchCollection(collectionName: string, query: string) {
  //   await this.client
  //     .index(collectionName)
  //     .search(query)
  //     .then((res) => console.log(res));
  // }

  protected override async multiMatchQuery(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    await this.client
      .index(collectionName)
      .search(keyword, {
        attributesToRetrieve: fields,
      })
      .then((res) => console.log(res));
  }

  protected override async placeholderQuery(
    collectionName: string,
    fields: string[],
  ) {
    await this.client
      .index(collectionName)
      .search()
      .then((res) => console.log(res));
  }

  private async checkStatus(taskId: number) {
    console.log(taskId);
    return new Promise<void>(async (resolve, reject) => {
      const id = setIntervalAsync(async () => {
        const res = await this.fetchStatus(taskId);
        if (res == true) {
          clearIntervalAsync(id);
          resolve();
        }
      }, 1000);
    });
  }

  private async fetchStatus(id: number) {
    const status = (await this.client.getTask(id)).status;
    console.log('taskId: ', id);
    console.log(status);
    if (status == 'succeeded') return true;
    if (status == 'failed')
      throw new Error('indexing meili collection failed: taskId ' + id);
    return false;
  }

  private allTasksFailed(arr: Task[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].status != 'failed') return false;
    }
    return true;
  }
}
