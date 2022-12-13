import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: '_id',
  })
  @IsOptional()
  _id: number;

  @ApiPropertyOptional({
    description: 'address',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\,]{1,50}$/,
    {
      message: 'địa chỉ không chứa các kí tự đặc biệt, không vượt quá 50 kí tự',
    },
  )
  address: string;

  @ApiProperty({
    description: 'cccd',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{9}|[0-9]{12}$/, {
    message: 'cccd chỉ chứa 9 hoặc 12 kí tự số',
  })
  cccd: string;

  @ApiProperty({
    description: 'university',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\-\ ]{1,50}$/,
    {
      message: 'university không chứa các kí tự đặc biệt',
    },
  )
  university: string;

  @ApiProperty({
    description: 'faculty',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\-]{1,50}$/,
    {
      message: 'falculty không chứa các ký tự đặc biệt',
    },
  )
  faculty: string;

  @ApiProperty({
    description: 'major',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\-]{1,50}$/,
    {
      message: 'major không chứa các ký tự đặc biệt',
    },
  )
  major: string;

  @ApiPropertyOptional({
    description: 'course',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[1-9]{1}[0-9]{3}\-[1-9]{1}[0-9]{3}$/, {
    message: 'Định dạng của course năm-năm',
  })
  course: string;

  @ApiProperty({
    description: 'gpa',
  })
  @IsNotEmpty()
  @Min(0.0)
  @Max(4.0)
  gpa: number;

  @ApiProperty({
    description: 'card_student',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]{1,50}$/, {
    message:
      'mã số thẻ sinh viên không chứa các ký tự đặc biệt hoặc khoảng trống',
  })
  card_student: string;

  @ApiProperty({
    description: 'id_account',
  })
  @IsOptional()
  @IsNumber()
  id_account: number;
}
