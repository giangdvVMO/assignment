import { PartialType } from '@nestjs/swagger';
import { CreateFieldRecruitDto } from './create-field-recruit.dto';

export class UpdateFieldRecruitDto extends PartialType(CreateFieldRecruitDto) {}
