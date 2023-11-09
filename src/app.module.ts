import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { EntityManager } from 'typeorm';

import { AppController } from './app.controller';

import { GithubDataModule } from './github-data/github-data.module';
import { TopRatedSearchModule } from './top-rated-search/top-rated-search.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          type:
            configService.get('NODE_ENV') === 'production' ? 'better-sqlite3' : 'sqlite',
          database: configService.get('DATABASE_PATH'),
          autoLoadEntities: true,
          synchronize: true,
        }) as TypeOrmModuleOptions,

      inject: [ConfigService],
    }),
    GithubDataModule,
    TopRatedSearchModule,
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly entityManager: EntityManager) {}

  async onModuleInit() {
    await this.entityManager.query('PRAGMA journal_mode = WAL;');

    this.logger.log('Database is in WAL mode.');
  }
}
