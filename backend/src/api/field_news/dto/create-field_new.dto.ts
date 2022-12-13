import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFieldNewDto {
  @ApiProperty({
    description: 'id_field',
  })
  @IsNotEmpty()
  fields: number[];

  @ApiProperty({
    description: 'id_news',
  })
  @IsNotEmpty()
  id_news: number;
}
