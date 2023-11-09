import { Controller, Post } from '@nestjs/common';

import { GithubDataService } from './github-data.service';

@Controller('github-data')
export class GithubDataController {
  constructor(private readonly githubDataService: GithubDataService) {}

  @Post('sync')
  async fetchAndPopulateDatabase() {
    try {
      const jobsCreated = await this.githubDataService.fetchGithubData();

      return { message: `${jobsCreated} jobs created.` };
    } catch (error) {
      return { error: 'Failed to initiate CSV download.' };
    }
  }
}
