import { PartialType } from '@nestjs/swagger';
import { CreateManufactureDto } from './create-manufacture.dto';

export class UpdateManufactureDto extends PartialType(CreateManufactureDto) {}
