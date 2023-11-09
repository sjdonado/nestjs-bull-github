import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { GithubRepository } from './entities/github-repository.entity';
import { GithubDataService } from './github-data.service';
import { GithubDataController } from './github-data.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([GithubRepository]),
    BullModule.registerQueue({
      name: 'github-download',
    }),
  ],
  controllers: [GithubDataController],
  providers: [GithubDataService],
  exports: [GithubDataService],
})
export class GithubDataModule {}
