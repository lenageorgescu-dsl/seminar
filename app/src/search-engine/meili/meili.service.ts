import { Inject, Injectable } from '@nestjs/common';
import MeiliSearch, { Task } from 'meilisearch';
import { BoolQuery, SearchEngineService } from '../search-engine.service';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';
import Tasks from '@elastic/elasticsearch/lib/api/api/tasks';

@Injectable()
export class MeiliService extends SearchEngineService {
  constructor(@Inject('MeiliSearch') private client: MeiliSearch) {
    super();
    this.engineName = 'meilisearch';
  }

  protected override async createCollection(collectionName: string, data: any) {
    const res = (await this.client.getTasks({ indexUids: [collectionName] }))
      .results;
    console.log(res);
    if (res.length > 0 && !this.allTasksFailed(res)) {
      //if task already exists and those tasks haven't all failed, don't create new task
      throw new Error(
        'Task ' + collectionName + ' already exists, will not be indexed again',
      );
    }
    const enquededTask = await this.client
      .index(collectionName)
      .addDocuments(data);
    await this.checkStatus(enquededTask.taskUid);
  }

  protected override async multiMatchQuery(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    const res = await this.client.index(collectionName).search(keyword, {
      attributesToRetrieve: fields,
    });
    return (res as undefined as any).nbHits;
  }

  protected override async placeholderQuery(collectionName: string) {
    const res = await this.client.index(collectionName).search();
    console.log(res.estimatedTotalHits);
    return res.estimatedTotalHits;
  }

  private async checkStatus(taskId: number) {
    console.log(taskId);
    return new Promise<void>(async (resolve, reject) => {
      const id = setIntervalAsync(async () => {
        const status = (await this.client.getTask(taskId)).status;
        console.log('Proccessing task ', taskId);
        if (status == 'succeeded') {
          clearIntervalAsync(id);
          resolve();
        }
        if (status == 'failed')
          throw new Error('indexing meili collection failed: taskId ' + taskId);
      }, 1000);
    });
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

  protected override async boolQuery(collectionName: string, query: BoolQuery) {
    console.log(collectionName);
    const fields = this.arrayUnique(query.and.concat(query.or));
    //await this.client.index(collectionName).updateFilterableAttributes(fields);
    const res = await this.client
      .index(collectionName)
      .updateFilterableAttributes(['title'])
      .catch((e) => {
        console.log(e);
      });
    console.log(res);
    // this.client
    //   .index(collectionName)
    //   .search('title = the AND authors = Rowling')
    //   .then((res) => { private async fetchStatus(id: number) {
  }

  private allTasksFailed(arr: Task[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].status != 'failed') return false;
    }
    return true;
  }
}
