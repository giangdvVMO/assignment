import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateApplyDto {
  @ApiProperty({
    description: 'id_student',
    example: 1,
  })
  @IsNotEmpty()
  // @IsNumber()
  id_student: number;

  @ApiProperty({
    description: 'id_recruit',
    example: 1,
  })
  @IsNotEmpty()
  // @IsNumber()
  id_recruit: number;
}

export class ConditionDto {
  @ApiPropertyOptional({
    description: 'id_student',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  id_student: number;

  @ApiPropertyOptional({
    description: 'id_company',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  id_company: number;
}

export class QueryDto {
  @ApiPropertyOptional({
    description: 'id_student',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  id_student: number;

  @ApiPropertyOptional({
    description: 'id_company',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  id_company: number;

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
