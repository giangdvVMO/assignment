import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'com_name',
  })
  @IsOptional()
  @IsString()
  com_name: string;

  @ApiPropertyOptional({
    description: 'address',
  })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({
    description: 'year',
  })
  @IsOptional()
  year: number;

  @ApiPropertyOptional({
    description: 'com_phone',
  })
  @IsOptional()
  com_phone: string;

  @ApiPropertyOptional({
    description: 'com_email',
  })
  @IsOptional()
  @IsEmail()
  com_email: string;

  @ApiPropertyOptional({
    description: 'website',
  })
  @IsOptional()
  website: string;

  @ApiPropertyOptional({
    description: 'introduction',
  })
  @IsOptional()
  introduction: string;

  @ApiPropertyOptional({
    description: 'scale',
  })
  @IsOptional()
  scale: number;

  @ApiPropertyOptional({
    description: 'manufacture',
  })
  @IsOptional()
  @IsArray()
  manufacture: number[];

  @ApiPropertyOptional({
    description: 'update_id',
  })
  @IsOptional()
  update_id: number;

  @ApiPropertyOptional({
    description: 'status',
  })
  @IsOptional()
  status: boolean;
}
