import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { firstValueFrom } from 'rxjs';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
@Injectable()
export class IndexingService implements OnApplicationBootstrap {
  constructor(private readonly http: HttpService) {}
  onApplicationBootstrap() {
    this.pingServer();
  }
  public async pingServer(): Promise<void> {
    try {
      const { status, data } = await firstValueFrom(
        this.http.get('http://localhost:8108/health', {
          responseType: 'stream',
        }),
      );
      console.log('Typesense response:', status);
    } catch (e) {
      console.log('Typesense not found: ');
      console.log(e);
      throw new Error();
    }
    try {
      const { status, data } = await firstValueFrom(
        this.http.get('http://localhost:7700/health', {
          responseType: 'stream',
        }),
      );
      console.log('Meili response:', status);
    } catch (e) {
      console.log('Meilisearch not found: ');
      console.log(e);
      throw new Error();
    }
    try {
      const { status, data } = await firstValueFrom(
        this.http.get(
          'http://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=50s&pretty',
        ),
      );
      console.log('Elastic response:', status);
    } catch (e) {
      console.log('Elasticsearch not found: ');
      console.log(e);
      throw new Error();
    }
    this.createTypeSenseCollection();
  }

  private async createTypeSenseCollection() {
    const client = new Client({
      nodes: [
        {
          host: 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
          port: 8108, // For Typesense Cloud use 443
          protocol: 'http', // For Typesense Cloud use https
        },
      ],
      apiKey: 'xyz',
      connectionTimeoutSeconds: 2,
    });
    const booksSchema = {
      name: 'books',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'authors', type: 'string[]', facet: true },

        { name: 'publication_year', type: 'int32', facet: true },
        { name: 'ratings_count', type: 'int32' },
        { name: 'average_rating', type: 'float' },
      ],
      default_sorting_field: 'ratings_count',
    };
    client
      .collections()
      .create(booksSchema as CollectionCreateSchema)
      .catch((e) => {
        console.log(e);
      });
    const booksInJson1 = await (await readFile('/tmp/books.jsonl')).toString();
    if (booksInJson1 == undefined) throw new Error('File not found');
    client.collections('books').documents().import(booksInJson1);
    const searchParameters = {
      q: 'harry potter',
      query_by: 'title',
      sort_by: 'ratings_count:desc',
    };
    client
      .collections('books')
      .documents()
      .search(searchParameters)
      .then(function (searchResults) {
        console.log(JSON.stringify(searchResults));
      });
  }
}
