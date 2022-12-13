import { Module } from '@nestjs/common';
import { ManufactureService } from './manufacture.service';
import { ManufactureController } from './manufacture.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Manufacture, ManufactureSchema } from './manufacture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manufacture.name, schema: ManufactureSchema },
    ]),
  ],
  controllers: [ManufactureController],
  providers: [ManufactureService],
  exports: [ManufactureService],
})
export class ManufactureModule {}
