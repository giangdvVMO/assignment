import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsNumberString,
} from 'class-validator';

export class QueryParamDto {
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
  @IsOptional()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  role: string;
}

export class ParamIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
