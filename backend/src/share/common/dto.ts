import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryDTO {
  @ApiPropertyOptional({
    description: 'pageSize',
    type: 'number',
  })
  @IsOptional()
  pageSize: number;

  @ApiPropertyOptional({
    description: 'pageIndex',
    type: 'number',
  })
  @IsOptional()
  pageIndex: number;
}
