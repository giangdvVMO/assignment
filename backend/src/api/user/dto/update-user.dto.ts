import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'username',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s]{1,50}$/,
    {
      message: 'username không chứa các ký tự đặc biệt',
    },
  )
  username?: string;

  @ApiPropertyOptional({
    description: 'email',
  })
  @IsOptional()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9\s\@\.\_]{1,50}$/, {
    message: 'email không có dấu',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'fullname',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s]{1,100}$/,
    {
      message: 'fullname không chứa các ký tự đặc biệt',
    },
  )
  fullname?: string;

  @ApiPropertyOptional({
    description: 'birthday',
  })
  @IsOptional()
  // @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({
    description: 'avatar',
  })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  @Matches(/^0{1}[1-9]{1}[0-9]{8}$/, {
    message: 'Chưa đúng định dạng số điện thoại: 10 kí tự số',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'socket_id',
  })
  @IsOptional()
  socket_id?: string;
}

export class ChangeUserPasswordDto {
  @ApiProperty({
    description: 'id',
    example: 12,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'old password',
    example: '123456abc',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]{6,50}$/, {
    message: 'password chỉ chứa kí tự chữ và số và tối thiểu 6 kí tự',
  })
  oldPassword: string;

  @ApiProperty({
    description: 'new password',
    example: '123456abc',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]{6,50}$/, {
    message: 'newpassword chỉ chứa kí tự chữ và số và tối thiểu 6 kí tự',
  })
  newPassword: string;

  @ApiProperty({
    description: 'confirm password',
    example: '123456abc',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]{6,50}$/, {
    message: 'confirmpassword chỉ chứa kí tự chữ và số và tối thiểu 6 kí tự',
  })
  confirmPassword: string;
}

export class UpdateInforUser {
  @ApiPropertyOptional({
    description: 'first_name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  first_name: string;

  @ApiPropertyOptional({
    description: 'last_name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  last_name: string;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({
    description: 'start_date',
  })
  @IsOptional()
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({
    description: 'gender',
  })
  @IsOptional()
  gender: number;

  @ApiPropertyOptional({
    description: 'birthday',
  })
  @IsOptional()
  @IsDateString()
  birthday: string;
}

export class FileUploadDto extends UpdateInforUser {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image: any;
}
