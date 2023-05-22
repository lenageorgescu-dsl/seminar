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
    this.engineName = 'elastic';
  }

  protected async createCollection(collectionName: string, data: any) {
    const res = await this.client.indices.exists({ index: collectionName });
    if (res)
      throw new Error(
        'Collection ' + collectionName + ' already exists in Elastic',
      );
    console.log('exist result: ', res);

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
  }

  protected override async placeholderQuery(collectionName: string) {
    await this.client.indices.refresh({ index: collectionName });
    const result = await this.client.search<Document>({
      index: collectionName,
      query: {
        match_all: {},
      },
    });
    //console.log(JSON.stringify(result.hits.hits.length, null, 2));
    return result.hits.hits.length;
  }

  protected override async multiMatchQuery(
    collectionName: string,
    keyword: string,
    fields: string[],
  ) {
    await this.client.indices.refresh({ index: collectionName });
    const result = await this.client.search<Document>({
      index: collectionName,
      query: {
        multi_match: { query: keyword, fields: fields },
      },
    });
    //console.log(result.hits.hits);
    return result.hits.hits.length;
  }
}
