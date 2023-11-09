import axios from 'axios';
import * as csvParser from 'csv-parser';

import { Logger } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

import { GithubRepository } from './entities/github-repository.entity';

@Processor('github-download')
export class GithubDownloadProcessor {
  private readonly logger = new Logger(GithubDownloadProcessor.name);

  constructor(
    @InjectRepository(GithubRepository)
    private readonly githubRepository: Repository<GithubRepository>
  ) {}

  @Process('download-csv')
  async downloadAndParse(job: Job<{ csvUrl: string; isoDate: string }>) {
    const { csvUrl, isoDate } = job.data;
    this.logger.debug(`Job started ${isoDate}`);

    try {
      const response = await axios.get(csvUrl, { responseType: 'stream' });
      const parseStream = response.data.pipe(csvParser());

      for await (const row of parseStream) {
        const repo = this.githubRepository.create({
          rank: row.rank,
          item: row.item,
          repoName: row.repo_name,
          stars: row.stars,
          forks: row.forks,
          language: row.language,
          repoUrl: row.repo_url,
          username: row.username,
          issues: row.issues,
          lastCommit: row.last_commit,
          description: row.description,
          reportDate: isoDate,
        });

        await this.githubRepository.save(repo);
      }

      this.logger.debug(`Downloaded and parsed CSV ${isoDate}`);
    } catch (error) {
      this.logger.error(`Error downloading CSV ${isoDate}: ${error.message}`);
    }
  }
}
