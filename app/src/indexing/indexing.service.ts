import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { readFile } from 'fs/promises';
import MeiliSearch from 'meilisearch';
import { firstValueFrom } from 'rxjs';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { Client as ElastiClient } from '@elastic/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { estypesWithBody } from '@elastic/elasticsearch';
import { readFileSync } from 'fs';
import * as movies from '/home/lena/bfh/seminar/app/assets/testdata/movies.json';

@Injectable()
export class IndexingService implements OnApplicationBootstrap {
  constructor(private readonly http: HttpService) {}
  onApplicationBootstrap() {
    this.pingServer();
  }
  public async pingServer(): Promise<void> {
    try {
      const { status } = await firstValueFrom(
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
      const { status } = await firstValueFrom(
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
      const { status } = await firstValueFrom(
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
    //this.typesenseSearch();
    // this.meiliSearch();
    // this.typesenseSearch();
    this.elasticSearch();
  }

  private async elasticSearch() {
    const client = new ElastiClient({
      node: 'http://localhost:9200',
    });

    interface Document {
      character: string;
      quote: string;
    }

    async function run() {
      //Let's start by indexing some data
      await client.index({
        index: 'game-of-thrones',
        document: {
          character: 'Ned Stark',
          quote: 'Winter is coming.',
        },
      });

      await client.index({
        index: 'game-of-thrones',
        document: {
          character: 'Daenerys Targaryen',
          quote: 'I am the blood of the dragon.',
        },
      });

      await client.index({
        index: 'game-of-thrones',
        document: {
          character: 'Tyrion Lannister',
          quote: 'A mind needs books like a sword needs a whetstone.',
        },
      });

      // here we are forcing an index refresh, otherwise we will not
      // get any result in the consequent search
      await client.indices.refresh({ index: 'game-of-thrones' });

      // Let's search!
      const result = await client.search<Document>({
        index: 'game-of-thrones',
        query: {
          match: { quote: 'winter' },
        },
      });

      console.log(result.hits.hits);
    }

    run().catch(console.log);
  }

  private async meiliSearch() {
    const client = new MeiliSearch({
      host: 'http://localhost:7700',
    });
    // const movies = JSON.parse(
    //   readFileSync('../app/assets/testdata/movies.json', 'utf-8'),
    // );
    const documents = [
      { id: 1, title: 'Carol', genres: ['Romance', 'Drama'] },
      { id: 2, title: 'Wonder Woman', genres: ['Action', 'Adventure'] },
      { id: 3, title: 'Life of Pi', genres: ['Adventure', 'Drama'] },
      {
        id: 4,
        title: 'Mad Max: Fury Road',
        genres: ['Adventure', 'Science Fiction'],
      },
      { id: 5, title: 'Moana', genres: ['Fantasy', 'Action'] },
      { id: 6, title: 'Philadelphia', genres: ['Drama'] },
    ];

    try {
      await client
        .index('docs')
        .addDocuments(documents)
        .then((res) => console.log(res));
    } catch (e) {
      console.log(e);
    }
    client
      .index('docs')
      .search('Pi')
      .then((res) => console.log(res));
  }

  private async typesenseSearch() {
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
    const booksInJson1 = await (
      await readFile('../app/assets/testdata/books.jsonl')
    ).toString();
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
        console.log(JSON.stringify(searchResults, null, 2));
      });
  }
}
