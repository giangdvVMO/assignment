import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateRecruitDto {
  @ApiPropertyOptional({
    description: 'title',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'way_working',
  })
  @IsOptional()
  way_working: string;

  @ApiPropertyOptional({
    description: 'salary',
  })
  @IsOptional()
  salary: number;

  @ApiPropertyOptional({
    description: 'quantity',
  })
  @IsOptional()
  quantity: number;

  @ApiPropertyOptional({
    description: 'level',
  })
  @IsOptional()
  level: string;

  @ApiPropertyOptional({
    description: 'gender',
  })
  @IsOptional()
  gender: boolean;

  @ApiPropertyOptional({
    description: 'address_working',
  })
  @IsOptional()
  @IsEmail()
  address_working: string;

  @ApiPropertyOptional({
    description: 'experience',
  })
  @IsOptional()
  experience: number;

  @ApiPropertyOptional({
    description: 'website',
  })
  @IsOptional()
  website: string;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'requirement',
  })
  @IsOptional()
  requirement: string;

  @ApiPropertyOptional({
    description: 'welfare',
  })
  @IsOptional()
  welfare: string;

  @ApiPropertyOptional({
    description: 'start_date',
  })
  @IsOptional()
  start_date: string;

  @ApiPropertyOptional({
    description: 'end_date',
  })
  @IsOptional()
  end_date: string;

  @ApiPropertyOptional({
    description: 'id_company',
  })
  @IsOptional()
  id_company: number;
}

export class DeleteDto {
  @ApiProperty({
    description: 'delete_id',
  })
  delete_id: number;
}
