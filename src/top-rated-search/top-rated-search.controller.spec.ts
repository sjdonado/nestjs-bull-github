import { Test, TestingModule } from '@nestjs/testing';
import { ReposRankingController } from './repos-ranking.controller';

describe('ReposRankingController', () => {
  let controller: ReposRankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReposRankingController],
    }).compile();

    controller = module.get<ReposRankingController>(ReposRankingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
