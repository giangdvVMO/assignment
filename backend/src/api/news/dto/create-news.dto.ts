import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    description: 'title',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s()\/\.\,\-]{1,50}$/,
    {
      message: 'title không chứa các ký tự đặc biệt',
    },
  )
  title: string;

  @ApiProperty({
    description: 'content',
  })
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'status',
  })
  @IsOptional()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({
    description: 'fields',
  })
  @IsNotEmpty()
  @IsArray()
  fields: number[];

  @ApiProperty({
    description: 'thumnail',
  })
  @IsNotEmpty()
  thumnail: string;

  @ApiProperty({
    description: 'id_account',
  })
  @IsNotEmpty()
  id_account: number;
}

export class ConfirmNewsDto {
  @ApiProperty({
    description: 'confirm_id',
  })
  @IsNotEmpty()
  confirm_id: number;
}
