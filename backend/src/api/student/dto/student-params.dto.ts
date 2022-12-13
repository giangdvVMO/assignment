import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryParamStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageIndex: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageSize: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEnum(['desc', 'asc'])
  sortOrder: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  university: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  major: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  status: string;
}
