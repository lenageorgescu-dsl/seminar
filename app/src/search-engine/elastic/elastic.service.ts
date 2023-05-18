import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { estypesWithBody } from '@elastic/elasticsearch';
import { SearchEngineService } from '../search-engine.service';

interface Document {
  character: string;
  quote: string;
}

@Injectable()
export class ElasticService extends SearchEngineService {
  constructor(@Inject('ElasticSearch') private client: Client) {
    super();
    this.engineName = 'Elastic';
  }

  protected async createCollection(collectionName: string, data: any) {
    try {
      await this.client.helpers
        .bulk({
          datasource: data,
          onDocument(doc) {
            return {
              index: { _index: collectionName },
            };
          },
        })
        .then((res) => console.log(res));
    } catch (e) {
      console.log(e);
    }
  }

  async searchCollection(collectionName: string, query: string) {
    await this.client.indices.refresh({ index: collectionName });

    // Let's search!
    const result = await this.client.search<Document>({
      index: collectionName,
      query: {
        match: { text: 'Rowling' },
      },
    });

    console.log(result.hits.hits);
  }
}
