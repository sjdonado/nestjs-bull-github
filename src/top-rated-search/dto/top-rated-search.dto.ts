import { IsDateString, IsString, IsInt } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { DateTime } from 'luxon';

export class TopRatedSearchDto {
  @IsDateString()
  @Transform(({ value }: TransformFnParams) =>
    DateTime.fromISO(value).toFormat('yyyy-MM-dd')
  )
  date: string;

  @IsString()
  language: string;

  @IsInt()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  limit: number;
}
