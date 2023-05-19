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
    const res = await this.client.getTasks({ indexUids: [collectionName] });
    if (res.results.length > 0 && !this.allTasksFailed(res.results)) {
      //if task already exists and those tasks haven't all failed, don't create new task
      console.log(
        'Task ' + collectionName + ' already exists, will not be indexed again',
      );
      return;
    }
    try {
      await this.client
        .index(collectionName)
        .addDocuments(data)
        .then((res) => {
          console.log(res);
        });
      const tasks = await this.client.getTasks({ indexUids: [collectionName] });
      console.log('tasks here:', tasks.results);
      const id = tasks.results.pop().uid;
      await this.checkStatus(id);
    } catch (e) {
      console.log(e);
    }
  }

  allTasksFailed(arr: Task[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].status != 'failed') return false;
    }
    return true;
  }

  async searchCollection(collectionName: string, query: string) {
    await this.client
      .index(collectionName)
      .search(query)
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
}
