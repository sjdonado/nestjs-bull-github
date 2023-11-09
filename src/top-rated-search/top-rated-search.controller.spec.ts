import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';

import { GithubDataService } from '@src/github-data/github-data.service';
import { GithubRepository } from '@src/github-data/entities/github-repository.entity';

import { TopRatedSearchController } from './top-rated-search.controller';
import { TopRatedSearchDto } from './dto/top-rated-search.dto';

describe('TopRatedSearchController', () => {
  let controller: TopRatedSearchController;
  let githubDataService: DeepMocked<GithubDataService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopRatedSearchController],
      providers: [
        {
          provide: GithubDataService,
          useValue: {
            getReposByLanguageAndDate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(TopRatedSearchController);
    githubDataService = module.get(GithubDataService);
  });

  describe('getReposRanking', () => {
    it('should return 200 OK with matching entities for valid filters', async () => {
      const query: TopRatedSearchDto = {
        language: 'typescript',
        date: '2023-01-01',
        limit: 10,
      };

      const sampleRepos: GithubRepository[] = Array.from({ length: 10 }, (_, index) => {
        return {
          id: index + 1,
          rank: faker.number.int(),
          item: faker.lorem.word(),
          repoName: faker.lorem.words(2),
          stars: faker.number.int(),
          forks: faker.number.int(),
          language: 'typescript',
          repoUrl: faker.internet.url(),
          username: faker.internet.userName(),
          issues: faker.number.int(),
          lastCommit: faker.date.past().toISOString(),
          description: faker.lorem.sentence(),
          reportDate: '2023-01-01',
        } as GithubRepository;
      });

      githubDataService.getReposByLanguageAndDate.mockResolvedValue(sampleRepos);

      const result = await controller.getReposRanking(query);

      expect(result).toEqual(sampleRepos);
      expect(githubDataService.getReposByLanguageAndDate).toHaveBeenCalledWith(
        'typescript',
        '2023-01-01',
        10
      );
    });

    it('should be case-insensitive for language', async () => {
      const query: TopRatedSearchDto = {
        language: 'TypeScript',
        date: '2023-01-01',
        limit: 10,
      };

      await controller.getReposRanking(query);

      expect(githubDataService.getReposByLanguageAndDate).toHaveBeenCalledWith(
        'TypeScript',
        '2023-01-01',
        10
      );
    });

    it('should handle different sizes of response because of limit', async () => {
      const query1: TopRatedSearchDto = {
        language: 'typescript',
        date: '2023-01-01',
        limit: 5,
      };
      const query2: TopRatedSearchDto = {
        language: 'typescript',
        date: '2023-01-01',
        limit: 15,
      };

      await controller.getReposRanking(query1);
      await controller.getReposRanking(query2);

      expect(githubDataService.getReposByLanguageAndDate).toHaveBeenCalledWith(
        'typescript',
        '2023-01-01',
        5
      );
      expect(githubDataService.getReposByLanguageAndDate).toHaveBeenCalledWith(
        'typescript',
        '2023-01-01',
        15
      );
    });
  });
});
