import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /ping', () => {
    it('should return status ok', () => {
      const result = appController.get();

      expect(result).toEqual({ status: 'ok' });
    });
  });
});
