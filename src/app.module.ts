import { JurisdictiondbService } from './building-jurisdiction/jurisdictiondb.service';
import { JurisdictionService } from './building-jurisdiction/jurisdiction.service';
import { JurisdictionController } from './building-jurisdiction/jurisdiction.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
    JurisdictionController, AppController],
  providers: [
        JurisdictiondbService, 
        JurisdictionService, AppService],
})
export class AppModule { }
