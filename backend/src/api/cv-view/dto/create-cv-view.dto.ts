import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCvViewDto {
  @ApiProperty({
    description: 'id_company',
  })
  @IsNotEmpty()
  id_company: number;

  @ApiProperty({
    description: 'id_cv',
  })
  @IsNotEmpty()
  id_cv: number;

  @ApiPropertyOptional({
    description: 'views',
  })
  @IsOptional()
  views: number;
}
