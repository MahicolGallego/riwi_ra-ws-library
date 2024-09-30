import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

export class FindLeakedBooksDto {
  // Define properties for the search process for all filtered books process for swagger documentation with @ApiProperty decorator
  @ApiProperty({ type: 'string' })
  @IsOptional()
  author?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  gender?: string;

  @ApiProperty({ type: 'date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publish_date?: Date;
}
