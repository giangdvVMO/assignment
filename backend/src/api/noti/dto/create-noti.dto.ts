import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotiDto {
  @ApiProperty({
    description: 'title',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'type',
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'content',
  })
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'content',
  })
  @IsOptional()
  link: string;

  @ApiProperty({
    description: 'send_id',
  })
  @IsNotEmpty()
  send_id: number;

  @ApiProperty({
    description: 'receive_id',
  })
  @IsNotEmpty()
  receive_id: number[];
}

export class UpdateNotiDto {
  @ApiProperty({
    description: 'status',
  })
  @IsNotEmpty()
  status: boolean;
}
