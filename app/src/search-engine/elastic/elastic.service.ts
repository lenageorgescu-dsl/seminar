import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { estypesWithBody } from '@elastic/elasticsearch';
import { BoolQuery, SearchEngineService } from '../search-engine.service';

interface Document {
  character: string;
  quote: string;
}

@Injectable()
export class ElasticService extends SearchEngineService {
  constructor(@Inject('ElasticSearch') private client: Client) {
    super();
    this.engineName = 'elasticsearch';
  }

  protected async createCollection(collectionName: string, data: any) {
    const res = await this.client.indices.exists({ index: collectionName });
    if (res)
      throw new Error(
        'Collection ' + collectionName + ' already exists in Elastic',
      );

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

  protected override async boolQuery(
    collectionName: string,
    keyword: string,
    query: BoolQuery,
  ) {
    await this.client.indices.refresh({ index: collectionName });
    const and = this.formatAND(query);
    const or = this.reduce(this.formatOR(query)); //makes array into object
    const result = await this.client.search<Document>({
      index: collectionName,
      query: {
        bool: {
          should: [
            or,
            {
              bool: {
                must: and,
              },
            },
          ],
        },
      },
    });
    return (result as undefined as any).hits.total.value;
  }

  private formatAND(query: BoolQuery) {
    const res: any[] = [];
    for (let i = 0; i < query.and.length; i++) {
      const obj = { match: query.and[i] };
      res.push(obj);
    }
    return res;
  }

  private reduce(arr: any[]) {
    const obj = arr.reduce((acc, cur, i) => {
      acc[i] = cur;
      return acc;
    }, {});
    return obj;
  }

  private formatOR(query: BoolQuery) {
    const res: any[] = [];
    for (let i = 0; i < query.or.length; i++) {
      const obj = { match: query.or[i] };
      res.push(obj);
    }
    return res;
  }

  protected override async placeholderQuery(collectionName: string) {
    await this.client.indices.refresh({ index: collectionName });
    const result = await this.client.search<Document>({
      index: collectionName,
      query: {
        match_all: {},
      },
    });
    return (result as undefined as any).hits.total.value;
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
    return (result as undefined as any).hits.total.value;
  }
}
