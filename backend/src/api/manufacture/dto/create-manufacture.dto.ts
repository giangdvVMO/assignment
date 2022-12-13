import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateManufactureDto {
  @ApiProperty({
    description: '_id',
    example: 1,
  })
  @IsNotEmpty()
  _id: number;

  @ApiProperty({
    description: 'name_manu',
    example: 'name_manu',
  })
  @IsNotEmpty()
  name_manu: string;
}

export class CreateManufactureArrayDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  array: CreateManufactureDto[];
}
