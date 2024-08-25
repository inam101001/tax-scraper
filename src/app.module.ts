import { IncomeTaxDbService } from './incomeTax-rates-brackets/incometax-db.service';
import { IncomeTaxService } from './incomeTax-rates-brackets/incometax.service';
import { IncomeTaxController } from './incomeTax-rates-brackets/incometax.controller';
import { PaginationController } from './median-property-taxes/pagination.controller';
import { PaginationDbService } from './median-property-taxes/pagination-db.service';
import { PaginationService } from './median-property-taxes/pagination.service';
import { IncomeController } from './income-taxes/income.controller';
import { IncomeDbService } from './income-taxes/income-db.service';
import { IncomeService } from './income-taxes/income.service';
import { PropertyDbService } from './property-taxes/property-db.service';
import { PropertyService } from './property-taxes/property.service';
import { PropertyController } from './property-taxes/property.controller';
import { JurisdictiondbService } from './building-jurisdiction/jurisdiction-db.service';
import { JurisdictionService } from './building-jurisdiction/jurisdiction.service';
import { JurisdictionController } from './building-jurisdiction/jurisdiction.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
        IncomeTaxController, 
        PaginationController, 
    IncomeController,
    PropertyController,
    JurisdictionController, AppController],
  providers: [
        IncomeTaxDbService, 
        IncomeTaxService, 
    PaginationDbService,
    PaginationService,
    IncomeDbService,
    IncomeService,
    PropertyDbService,
    PropertyService,
    JurisdictiondbService,
    JurisdictionService, AppService],
})
export class AppModule { }
