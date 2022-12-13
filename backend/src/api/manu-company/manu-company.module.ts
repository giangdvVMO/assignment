import { Module } from '@nestjs/common';
import { ManuCompanyService } from './manu-company.service';
import { ManuCompanyController } from './manu-company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ManuCompany, ManuCompanySchema } from './manu-company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ManuCompany.name, schema: ManuCompanySchema },
    ]),
  ],
  controllers: [ManuCompanyController],
  providers: [ManuCompanyService],
  exports: [ManuCompanyService],
})
export class ManuCompanyModule {}
