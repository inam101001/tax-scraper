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
        IncomeController, 
    PropertyController,
    JurisdictionController, AppController],
  providers: [
        IncomeDbService, 
        IncomeService, 
    PropertyDbService,
    PropertyService,
    JurisdictiondbService,
    JurisdictionService, AppService],
})
export class AppModule { }
