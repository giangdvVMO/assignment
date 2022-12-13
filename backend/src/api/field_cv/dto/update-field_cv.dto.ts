import { PartialType } from '@nestjs/swagger';
import { CreateFieldCvDto } from './create-field_cv.dto';

export class UpdateFieldCvDto extends PartialType(CreateFieldCvDto) {}
