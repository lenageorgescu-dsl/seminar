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
    field: string,
    query: BoolQuery,
  ) {
    await this.client.indices.refresh({ index: collectionName });
    let boolquery = {};
    if (query.and.length == 0) {
      throw new Error('Empty boolQuery');
    }
    boolquery = this.getAndQuery(keyword, field, query);
    const result = await this.client.search<Document>({
      index: collectionName,
      query: boolquery,
    });
    return (result as undefined as any).hits.total.value;
  }

  private getAndQuery(keyword: string, field: string, query: BoolQuery) {
    const and = this.formatAND(query);
    const res = {
      bool: {
        must: [{ match: { [field]: keyword } }],
        must_not: and,
      },
    };
    return res;
  }

  private formatAND(query: BoolQuery) {
    const res: any[] = [];
    for (let i = 0; i < query.and.length; i++) {
      const obj = { term: query.and[i] };
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
