import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexingService } from './indexing/indexing.service';
import { ElasticService } from './elastic/elastic.service';
import { MeiliService } from './meili/meili.service';
import { TypesenseService } from './typesense/typesense.service';
import { HealthService } from './health/health.service';
import { Client } from 'typesense';
import MeiliSearch from 'meilisearch';
import { Client as ElastiClient } from '@elastic/elasticsearch';
import { SearchService } from './search/search.service';
import { ExperimentService } from './experiment/experiment.service';

const typeSenseProvider: Provider = {
  provide: 'Typesense',
  useValue: new Client({
    nodes: [
      {
        host: 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
        port: 8108, // For Typesense Cloud use 443
        protocol: 'http', // For Typesense Cloud use https
      },
    ],
    apiKey: 'xyz',
    connectionTimeoutSeconds: 2,
  }),
};

const meiliProvider: Provider = {
  provide: 'MeiliSearch',
  useValue: new MeiliSearch({
    host: 'http://localhost:7700',
  }),
};

const elasticProvider: Provider = {
  provide: 'ElasticSearch',
  useValue: new ElastiClient({
    node: 'http://localhost:9200',
  }),
};

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    AppService,
    IndexingService,
    ElasticService,
    MeiliService,
    TypesenseService,
    HealthService,
    typeSenseProvider,
    meiliProvider,
    elasticProvider,
    SearchService,
    ExperimentService,
  ],
})
export class AppModule {}
