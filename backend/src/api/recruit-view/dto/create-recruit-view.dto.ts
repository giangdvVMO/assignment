import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRecruitViewDto {
  @ApiProperty({
    description: 'id_student',
  })
  @IsNotEmpty()
  id_student: number;

  @ApiProperty({
    description: 'id_recruit',
  })
  @IsNotEmpty()
  id_recruit: number;

  @ApiPropertyOptional({
    description: 'views',
  })
  @IsOptional()
  views: number;
}
