import { Module } from '@nestjs/common';

import { TopRatedSearchController } from './top-rated-search.controller';
import { GithubDataModule } from 'src/github-data/github-data.module';

@Module({
  imports: [GithubDataModule],
  controllers: [TopRatedSearchController],
  providers: [],
})
export class TopRatedSearchModule {}
