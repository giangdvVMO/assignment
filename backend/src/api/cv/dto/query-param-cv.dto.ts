import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class QueryParamCVDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageIndex: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageSize: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEnum(['desc', 'asc'])
  sortOrder: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\,]{1,}$/,
    {
      message: 'search không chứa các ký tự đặc biệt',
    },
  )
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^[0-9\s\,]{1,50}$/, {
    message: 'field là mã ngành 1,2',
  })
  field: string;

  @ApiPropertyOptional()
  @IsOptional()
  speciality: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['0', '1', '2'])
  experience: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @IsEnum(['0', '1'], { message: 'status là 0 hoặc 1' })
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  id_student: string;
}
