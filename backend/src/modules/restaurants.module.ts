import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantsService } from '../services/restaurants.service';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { ScraperController } from '../controllers/scraper.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantsController, ScraperController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
