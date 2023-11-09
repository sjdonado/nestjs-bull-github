import got from 'got';
import csvParser from 'csv-parser';

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
  async downloadAndParse(job: Job<{ csvUrl: string }>) {
    this.logger.debug('Start downloading and parsing CSV...');
    this.logger.debug(job.data);

    const { csvUrl } = job.data;
    try {
      const response = got.stream(csvUrl);
      const parseStream = response.pipe(csvParser());

      for await (const row of parseStream) {
        const repo = this.githubRepository.create({
          rank: row.rank,
          item: row.item,
          repo_name: row.repo_name,
          stars: row.stars,
          forks: row.forks,
          language: row.language,
          repo_url: row.repo_url,
          username: row.username,
          issues: row.issues,
          last_commit: row.last_commit,
          description: row.description,
        });

        await this.githubRepository.save(repo);
      }

      this.logger.debug('Downloaded and parsed CSV from ' + csvUrl);
    } catch (error) {
      this.logger.error(`Error downloading CSV from ${csvUrl}: ${error.message}`);
    }
  }
}
