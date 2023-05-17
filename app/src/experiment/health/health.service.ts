import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(private readonly http: HttpService) {}
  public async checkHealth(): Promise<void> {
    try {
      const { status } = await firstValueFrom(
        this.http.get('http://localhost:8108/health', {
          responseType: 'stream',
        }),
      );
      console.log('Typesense response:', status);
    } catch (e) {
      console.log('Typesense server not found: ');
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
      console.log('Meilis server not found: ');
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
      console.log('Elastic server not found: ');
      console.log(e);
      throw new Error();
    }
  }
}
