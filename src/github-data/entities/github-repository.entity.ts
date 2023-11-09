import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('github_repository')
export class GithubRepository extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rank', type: 'int' })
  rank: number;

  @Column({ name: 'item', type: 'varchar', length: 255 })
  item: string;

  @Column({ name: 'repo_name', type: 'varchar', length: 255 })
  repo_name: string;

  @Column({ name: 'stars', type: 'int' })
  stars: number;

  @Column({ name: 'forks', type: 'int' })
  forks: number;

  @Column({ name: 'language', type: 'varchar', length: 255 })
  language: string;

  @Column({ name: 'repo_url', type: 'varchar', length: 255 })
  repo_url: string;

  @Column({ name: 'username', type: 'varchar', length: 255 })
  username: string;

  @Column({ name: 'issues', type: 'int' })
  issues: number;

  @Column({ name: 'last_commit', type: 'varchar', length: 255 })
  last_commit: string;

  @Column({ name: 'description', type: 'text' })
  description: string;
}
