import { Inject, Injectable } from '@nestjs/common';
import MeiliSearch from 'meilisearch';
import { SearchEngineService } from '../search-engine.service';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';

@Injectable()
export class MeiliService extends SearchEngineService {
  private static taskUid = 0;
  constructor(@Inject('MeiliSearch') private client: MeiliSearch) {
    super();
    this.engineName = 'Meili';
  }

  protected override async createCollection(collectionName: string, data: any) {
    try {
      await this.client
        .index(collectionName)
        .addDocuments(data)
        .then(async (res) => {
          console.log(res);
        });
    } catch (e) {
      console.log(e);
    }
    await this.checkStatus(MeiliService.taskUid);
    ++MeiliService.taskUid;
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
    return false;
  }
}
