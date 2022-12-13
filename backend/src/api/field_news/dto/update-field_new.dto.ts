import { PartialType } from '@nestjs/swagger';
import { CreateFieldNewDto } from './create-field_new.dto';

export class UpdateFieldNewDto extends PartialType(CreateFieldNewDto) {}
