import { IsDateString, IsString, IsInt } from 'class-validator';

export class TopRatedSearchDto {
  @IsDateString()
  date: string;

  @IsString()
  language: string;

  @IsInt()
  limit: number;
}
