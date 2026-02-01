import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { Restaurant } from '../entities/restaurant.entity';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * GET /restaurants
   * Liste tous les restaurants
   */
  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  /**
   * GET /restaurants/:id
   * Récupère un restaurant par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findOne(id);
  }
}
