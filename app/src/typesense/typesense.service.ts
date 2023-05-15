import { Inject, Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

@Injectable()
export class TypesenseService {
  constructor(@Inject('Typesense') private client: Client) {}

  async createCollection() {
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
    await this.client
      .collections()
      .create(booksSchema as CollectionCreateSchema)
      .catch((e) => {
        console.log(e);
      });
  }

  async addDataToCollection() {
    const booksInJson1 = await (
      await readFile('../app/assets/testdata/books.jsonl')
    ).toString();
    if (booksInJson1 == undefined) throw new Error('File not found');
    this.client.collections('books').documents().import(booksInJson1);
  }

  async searchCollection() {
    const searchParameters = {
      q: 'harry potter',
      query_by: 'title',
      sort_by: 'ratings_count:desc',
    };
    this.client
      .collections('books')
      .documents()
      .search(searchParameters)
      .then(function (searchResults) {
        console.log(JSON.stringify(searchResults, null, 2));
      });
  }
}
