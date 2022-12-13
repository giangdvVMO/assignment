import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  Max,
  Min,
} from 'class-validator';

const VIETNAMESE =
  'aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ';
export class CreateRateDto {
  @ApiProperty({
    description: 'id_student',
  })
  @IsNotEmpty()
  id_student: number;

  @ApiProperty({
    description: 'id_company',
  })
  @IsNotEmpty()
  id_company: number;

  @ApiProperty({
    description: 'content',
  })
  @IsNotEmpty()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\,\n]{1,1000}$/,
    {
      message:
        'nội dung đánh giá không chứa các kí tự đặc biệt, không vượt quá 1000 kí tự',
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
        'tiêu đề đánh giá không chứa các kí tự đặc biệt, không vượt quá 50 kí tự',
    },
  )
  title: string;

  @ApiProperty({
    description: 'type_rate',
  })
  @IsNotEmpty()
  @IsEnum(['student', 'company'], {
    message: 'Loại đánh giá chỉ người được đánh giá là student hoặc company',
  })
  type_rate: string;

  @ApiProperty({
    description: 'score',
  })
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  score: number;
}

export class RemoveDto {
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

export class ConfirmDto {
  @ApiProperty({
    description: 'confirm_id',
  })
  @IsNotEmpty()
  confirm_id: number;
}
