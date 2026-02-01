import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { Restaurant } from '../entities/restaurant.entity';

@Controller('scraper')
@UseGuards(ApiKeyGuard)
export class ScraperController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * POST /scraper/import
   * Import un restaurant depuis n8n
   * Protégé par API key (header x-api-key)
   */
  @Post('import')
  async import(@Body() createRestaurantDto: CreateRestaurantDto): Promise<{
    success: boolean;
    restaurant: Restaurant;
    action: 'created' | 'updated';
  }> {
    // Vérifier si le restaurant existe déjà
    const existing = await this.restaurantsService['restaurantsRepository'].findOne({
      where: {
        name: createRestaurantDto.name,
        address: createRestaurantDto.address,
      },
    });

    const restaurant = await this.restaurantsService.upsert(createRestaurantDto);

    return {
      success: true,
      restaurant,
      action: existing ? 'updated' : 'created',
    };
  }
}
