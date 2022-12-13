import { PartialType } from '@nestjs/swagger';
import { CreateCvViewDto } from './create-cv-view.dto';

export class UpdateCvViewDto extends PartialType(CreateCvViewDto) {}
