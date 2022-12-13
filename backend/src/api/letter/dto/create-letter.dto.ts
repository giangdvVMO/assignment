import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, Matches } from 'class-validator';

const VIETNAMESE =
  'aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ';
export class CreateLetterDto {
  @ApiProperty({
    description: 'id_account',
  })
  @IsNotEmpty()
  id_account: number;

  @ApiProperty({
    description: 'content',
  })
  @IsNotEmpty()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\,\n\/\(\)]{1,50}$/,
    {
      message:
        'nội dung thư không chứa các kí tự đặc biệt, không vượt quá 50 kí tự',
    },
  )
  content: string;

  @ApiProperty({
    description: 'title',
  })
  @IsNotEmpty()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\,]{1,50}$/,
    {
      message:
        'tiêu đề thư không chứa các kí tự đặc biệt, không vượt quá 50 kí tự',
    },
  )
  title: string;

  @ApiProperty({
    description: 'id_student',
  })
  @IsNotEmpty()
  @IsArray()
  students: number[];
}

export class ConditionLetterDto {
  @ApiPropertyOptional({
    description: 'id_student',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  id_student: number;

  @ApiPropertyOptional({
    description: 'id_company',
    example: 1,
  })
  @IsOptional()
  // @IsNumber()
  id_company: number;
}
