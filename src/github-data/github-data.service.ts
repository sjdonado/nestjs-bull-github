import { DateTime, Interval } from 'luxon';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { GithubRepository } from './entities/github-repository.entity';

@Injectable()
export class GithubDataService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(GithubRepository)
    private readonly githubRepository: Repository<GithubRepository>,
    @InjectQueue('github-download') private readonly downloadQueue: Queue
  ) {}

  async getReposByLanguage(language: string, limit: number): Promise<GithubRepository[]> {
    const repos = await this.githubRepository.find({
      where: { language },
      take: limit,
    });

    return repos;
  }

  async fetchGithubData() {
    const startDate = DateTime.fromObject({
      year: 2018,
      month: 12,
      day: 18,
    });

    // Get yesterday's date
    const endDate = DateTime.local().minus({ days: 1 });

    const intervals = Interval.fromDateTimes(
      startDate.startOf('day'),
      endDate.endOf('day')
    )
      .splitBy({ day: 1 })
      .map((date: Interval) => date.start?.toISODate());

    const csvBaseUrl = this.configService.get<string>('GITHUB_CSV_URL_BASE');

    for (let day = 0; day < intervals.length; day++) {
      const isoDate = intervals[day];
      const csvUrl = `${csvBaseUrl}${isoDate}.csv`;

      // Add a job to the queue
      await this.downloadQueue.add('download-csv', { csvUrl });

      // If 10 jobs have been added, wait for them to complete (to avoid rate limiting)
      if (day % 10 === 0) {
        await this.waitForJobsToComplete(10);
      }
    }
  }

  async waitForJobsToComplete(count: number) {
    return new Promise<void>(resolve => {
      this.downloadQueue.on('completed', async () => {
        count--;

        if (count === 0) {
          resolve();
        }
      });
    });
  }
}
