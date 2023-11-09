import { DateTime, Interval } from 'luxon';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { GithubRepository } from './entities/github-repository.entity';

@Injectable()
export class GithubDataService {
  private readonly logger = new Logger(GithubDataService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(GithubRepository)
    private readonly githubRepository: Repository<GithubRepository>,
    @InjectQueue('github-download') private readonly downloadQueue: Queue
  ) {}

  async getReposByLanguageAndDate(
    language: string,
    date: string,
    limit: number
  ): Promise<GithubRepository[]> {
    const repos = await this.githubRepository.find({
      where: {
        language: Like(`%${language}%`),
        reportDate: date,
      },
      take: limit,
    });

    return repos;
  }

  async fetchGithubData(): Promise<number> {
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
      this.logger.log(`Adding job to queue: ${csvUrl}`);
      await this.downloadQueue.add(
        'download-csv',
        {
          csvUrl,
          isoDate,
        },
        {
          // If 10 jobs have been added, increase the delay (to avoid rate limiting)
          delay: Math.floor(Math.random() * 30000 * ((day + 1) / 10)) + 10000,
          attempts: 2,
        }
      );
    }

    return intervals.length;
  }
}
