import { PartialType } from '@nestjs/swagger';
import { CreateManuCompanyDto } from './create-manu-company.dto';

export class UpdateManuCompanyDto extends PartialType(CreateManuCompanyDto) {}
