import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateManuCompanyDto {
  @ApiProperty({
    description: 'id_company',
    example: 1,
  })
  @IsNotEmpty()
  id_company: number;

  @ApiProperty({
    description: 'id_manu',
    example: 1,
  })
  @IsNotEmpty()
  id_manu: number;
}

export class CreateManuCompanyArrayDto {
  @ApiProperty({
    description: 'id_company',
    example: 1,
  })
  @IsNotEmpty()
  id_company: number;

  @ApiProperty({
    description: 'id_manu',
    example: [1, 2],
  })
  @IsNotEmpty()
  @IsArray()
  id_manu_array: number[];
}
