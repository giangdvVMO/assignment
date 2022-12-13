import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateFieldRecruitDto {
  @ApiProperty({
    description: 'id_field',
    example: 1,
  })
  @IsNotEmpty()
  id_field: number;

  @ApiProperty({
    description: 'id_recruit',
    example: 1,
  })
  @IsNotEmpty()
  id_recruit: number;
}

export class CreateFieldRecruitArrayDto {
  @ApiProperty({
    description: 'id_recruit',
    example: 1,
  })
  @IsNotEmpty()
  id_recruit: number;

  @ApiProperty({
    description: 'id_recruit',
    example: [1, 2],
  })
  @IsNotEmpty()
  @IsArray()
  id_field_array: number[];
}
