import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ type: 'number' })
  id_account: number;
}

export class CreateGalleryFileDto extends CreateGalleryDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
