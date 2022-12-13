import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @ApiProperty({
    description: 'delete_id',
  })
  delete_id: number;
}
