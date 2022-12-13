import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class QueryDto {
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
  @IsNumberString()
  @IsEnum(['0', '1'], { message: 'status là 0 hoặc 1' })
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^[0-9]{1,}$/, {
    message: 'id_student không đúng định dạng',
  })
  id_student: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^[0-9]{1,}$/, {
    message: 'id_comnpany không đúng định dạng',
  })
  id_company: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['student', 'company'], {
    message: 'type_rate là student hoặc company',
  })
  type_rate: string;
}
