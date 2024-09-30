import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsISBN, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBookDto {
  // Define properties for the create book process for swagger documentation with @ApiProperty decorator
  @ApiProperty()
  @IsISBN() // Verify is valid ISBN format
  @IsNotEmpty()
  isbn: string;

  @ApiProperty()
  @IsString()
  @Length(3, 50, {
    message: 'The author must have between 3 and 50 letters',
  })
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsString()
  @Length(3, 50, {
    message: 'The title must have between 3 and 50 letters',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @Length(3, 20, { message: 'The gender must have between 3 and 20 letters' })
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  publish_date: Date;
}
