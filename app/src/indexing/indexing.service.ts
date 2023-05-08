import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IndexingService implements OnApplicationBootstrap {
  constructor(private readonly http: HttpService) {}
  onApplicationBootstrap() {
    this.startIndexing();
  }
  public async startIndexing(): Promise<void> {
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
    console.log('success');
  }
}
