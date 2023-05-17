import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { estypesWithBody } from '@elastic/elasticsearch';

interface Document {
  character: string;
  quote: string;
}

@Injectable()
export class ElasticService {
  constructor(@Inject('ElasticSearch') private client: Client) {}

  async createCollection() {
    await this.client.index({
      index: 'game-of-thrones',
      document: {
        character: 'Ned Stark',
        quote: 'Winter is coming.',
      },
    });

    await this.client.index({
      index: 'game-of-thrones',
      document: {
        character: 'Daenerys Targaryen',
        quote: 'I am the blood of the dragon.',
      },
    });

    await this.client.index({
      index: 'game-of-thrones',
      document: {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.',
      },
    });
  }

  async searchCollection() {
    await this.client.indices.refresh({ index: 'game-of-thrones' });

    // Let's search!
    const result = await this.client.search<Document>({
      index: 'game-of-thrones',
      query: {
        match: { quote: 'winter' },
      },
    });

    console.log(result.hits.hits);
  }
}
