import { PartialType } from '@nestjs/swagger';
import { CreateRecruitViewDto } from './create-recruit-view.dto';

export class UpdateRecruitViewDto extends PartialType(CreateRecruitViewDto) {}
