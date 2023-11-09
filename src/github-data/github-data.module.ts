import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GithubRepository } from './entities/github-repository.entity';
import { GithubDataService } from './github-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([GithubRepository])],
  providers: [GithubDataService],
  exports: [GithubDataService],
})
export class GithubDataModule {}
