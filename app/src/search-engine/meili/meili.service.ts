import { Inject, Injectable } from '@nestjs/common';
import MeiliSearch, { Task } from 'meilisearch';
import { BoolQuery, SearchEngineService } from '../search-engine.service';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';

@Injectable()
export class MeiliService extends SearchEngineService {
  constructor(@Inject('MeiliSearch') private client: MeiliSearch) {
    super();
    this.engineName = 'meilisearch';
  }

  protected override async createCollection(collectionName: string, data: any) {
    await this.taskAlreadyExists(collectionName);
    const enquededTask = await this.client
      .index(collectionName)
      .addDocuments(data);
    await this.checkStatus(enquededTask.taskUid);
  }

  private async taskAlreadyExists(collectionName: string) {
    const res = (await this.client.getTasks({ indexUids: [collectionName] }))
      .results;
    if (res.length > 0 && !this.allTasksFailed(res)) {
      //if task already exists and those tasks haven't all failed, don't create new task
      throw new Error(
        'Task ' + collectionName + ' already exists, will not be indexed again',
      );
    }
  }

  protected override async multiMatchQuery(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    const res = await this.client.index(collectionName).search(keyword, {
      attributesToRetrieve: fields,
    });
    return res.estimatedTotalHits;
  }

  protected override async placeholderQuery(collectionName: string) {
    const res = await this.client.index(collectionName).search();
    return res.estimatedTotalHits;
  }

  private async checkStatus(taskId: number) {
    return new Promise<void>(async (resolve, reject) => {
      const id = setIntervalAsync(async () => {
        const status = (await this.client.getTask(taskId)).status;
        console.log('Meili proccessing task ', taskId);
        if (status == 'succeeded') {
          console.log('Meili finished indexing ', taskId);
          clearIntervalAsync(id);
          resolve();
        }
        if (status == 'failed')
          throw new Error('indexing meili collection failed: taskId ' + taskId);
      }, 1000);
    });
  }

  protected override async boolQuery(
    collectionName: string,
    keyword: string,
    query: BoolQuery,
  ) {
    await this.reindex(collectionName, query);
    const newQuery = this.stringifyBoolQuery(query, 'AND', 'OR', ' = ');
    const res = await this.client.index(collectionName).search('', {
      filter: newQuery,
    });
    return res.estimatedTotalHits;
  }

  private async reindex(collectionName: string, query: BoolQuery) {
    const fields = this.getFieldsFromBoolQuery(query);
    const res = await this.client
      .index(collectionName)
      .updateFilterableAttributes(fields);
    await this.checkStatus(res.taskUid);
  }

  private allTasksFailed(arr: Task[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].status != 'failed') return false;
    }
    return true;
  }
}
