import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GithubRepository } from './entities/github-repository.entity';

@Injectable()
export class GithubDataService {
  constructor(
    @InjectRepository(GithubRepository)
    private readonly githubRepository: Repository<GithubRepository>
  ) {}

  async getReposByLanguage(language: string, limit: number): Promise<GithubRepository[]> {
    const repos = await this.githubRepository.find({
      where: { language },
      take: limit,
    });

    return repos;
  }
}
