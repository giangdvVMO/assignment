import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class QueryParamRecruitDto {
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
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s()/\.\,\+]{1,}$/,
    {
      message: 'search không chứa các ký tự đặc biệt',
    },
  )
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^[0-9\s\,]{1,50}$/, {
    message: 'field là mã ngành 1,2 không chứa các ký tự đặc biệt',
  })
  field: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @IsEnum(['0', '1'], { message: 'status là 0 hoặc 1' })
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  id_company: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['0', '1', '2'], {
    message:
      'experience phải thuộc các giá trị là 0 (Không yêu cầu) hoặc 1 (Dưới 1 năm) hoặc 2(Trên 1 năm)',
  })
  experience: string;

  @ApiPropertyOptional()
  @IsOptional()
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  salary: string;
}
