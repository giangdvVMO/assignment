import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateFieldDto {
  @ApiProperty({
    description: '_id',
  })
  @IsNotEmpty()
  _id: number;

  @ApiProperty({
    description: 'name_field',
  })
  @IsNotEmpty()
  nameField: string;
}

export class CreateFieldArrayDto {
  @ApiProperty({
    description: 'field_array',
  })
  @IsNotEmpty()
  @IsArray()
  field_array: CreateFieldDto[];
}
