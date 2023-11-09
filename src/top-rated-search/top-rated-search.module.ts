import { Module } from '@nestjs/common';

import { GithubDataModule } from '@src/github-data/github-data.module';

import { TopRatedSearchController } from './top-rated-search.controller';

@Module({
  imports: [GithubDataModule],
  controllers: [TopRatedSearchController],
  providers: [],
})
export class TopRatedSearchModule {}
