import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLetterStudentDto {
  @ApiProperty({
    description: 'id_letter',
  })
  @IsNotEmpty()
  id_letter: number;

  @ApiProperty({
    description: 'id_student',
  })
  @IsNotEmpty()
  @IsArray()
  students: number[];
}

export class QueryLetterStudentDto {
  @ApiPropertyOptional({
    description: 'id_student',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  id_student: number;

  @ApiPropertyOptional({
    description: 'month',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  month: number;

  @ApiPropertyOptional({
    description: 'year',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  year: number;
}
