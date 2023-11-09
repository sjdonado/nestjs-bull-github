import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';

import { GithubDataService } from 'src/github-data/github-data.service';
import { TopRatedSearchDto } from './dto/top-rated-search.dto';

@Controller('search')
export class TopRatedSearchController {
  constructor(private readonly githubDataService: GithubDataService) {}

  @Get()
  async getReposRanking(@Query(ValidationPipe) query: TopRatedSearchDto) {
    const { language, limit } = query;

    const repos = await this.githubDataService.getReposByLanguage(language, limit);

    return repos;
  }
}
