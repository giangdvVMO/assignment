import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class QueryParamNewsDto {
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
  sort: string;

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
  @IsNumberString()
  @IsEnum(['0', '1'], { message: 'status là 0 hoặc 1' })
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  id_account: string;

  @ApiPropertyOptional()
  @IsOptional()
  except_id: string;
}
