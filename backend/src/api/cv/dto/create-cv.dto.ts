import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCvDto {
  @ApiProperty({
    description: 'title',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s()\/\.\,]{1,50}$/,
    {
      message: 'title không chứa các ký tự đặc biệt',
    },
  )
  title: string;

  @ApiProperty({
    description: 'id_student',
  })
  @IsNotEmpty()
  id_student: number;

  @ApiProperty({
    description: 'experience',
  })
  @IsNotEmpty()
  experience: string;

  @ApiProperty({
    description: 'speciality',
  })
  @IsNotEmpty()
  speciality: string;

  @ApiProperty({
    description: 'summary',
  })
  @IsNotEmpty()
  summary: string;

  @ApiProperty({
    description: 'certificate',
  })
  @IsNotEmpty()
  certificate: string;

  @ApiPropertyOptional({
    description: 'status',
  })
  @IsOptional()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'fields',
  })
  @IsNotEmpty()
  // @IsArray()
  fields: string;

  @ApiPropertyOptional({
    description: 'file_cv',
  })
  @IsOptional()
  @IsNotEmpty()
  file_cv: string;
}

export class FileCreateCVDto extends CreateCvDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file_cv: any;
}
