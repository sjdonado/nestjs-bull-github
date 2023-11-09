import { ConfigModule } from '@nestjs/config';
import { Logger, Module, OnModuleInit } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubRepository } from './entities/github-repository.entity';

import { Queue } from 'bull';
import { BullModule, InjectQueue } from '@nestjs/bull';

import { GithubDataService } from './github-data.service';
import { GithubDataController } from './github-data.controller';
import { GithubDownloadProcessor } from './github-data.processor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([GithubRepository]),
    BullModule.registerQueueAsync({
      name: 'github-download',
    }),
  ],
  controllers: [GithubDataController],
  providers: [GithubDataService, GithubDownloadProcessor],
  exports: [GithubDataService],
})
export class GithubDataModule implements OnModuleInit {
  private readonly logger = new Logger(GithubDataModule.name);

  constructor(@InjectQueue('github-download') private readonly downloadQueue: Queue) {}

  async onModuleInit() {
    if (this.downloadQueue.client.status === 'ready') {
      this.logger.log('Redis is ready');
    } else {
      throw new Error('Redis not available');
    }
  }
}
