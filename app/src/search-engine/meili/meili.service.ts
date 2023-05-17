import { Inject, Injectable } from '@nestjs/common';
import MeiliSearch from 'meilisearch';

@Injectable()
export class MeiliService {
  constructor(@Inject('MeiliSearch') private client: MeiliSearch) {}
  async createCollection() {
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
      await this.client
        .index('docs')
        .addDocuments(documents)
        .then((res) => console.log(res));
    } catch (e) {
      console.log(e);
    }
  }
  addDataToCollection() {
    return;
  }
  async searchCollection() {
    await this.client
      .index('docs')
      .search('Pi')
      .then((res) => console.log(res));
  }
}
