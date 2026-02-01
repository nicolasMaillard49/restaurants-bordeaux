import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  /**
   * Récupère tous les restaurants
   */
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({
      order: {
        rating: 'DESC',
        name: 'ASC',
      },
    });
  }

  /**
   * Récupère un restaurant par ID
   */
  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantsRepository.findOne({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  /**
   * Crée ou met à jour un restaurant (upsert)
   * Détecte les doublons via name + address
   */
  async upsert(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const { name, address } = createRestaurantDto;

    // Recherche d'un doublon existant
    const existing = await this.restaurantsRepository.findOne({
      where: { name, address },
    });

    if (existing) {
      // Update
      Object.assign(existing, {
        ...createRestaurantDto,
        last_update: new Date(),
      });
      return this.restaurantsRepository.save(existing);
    } else {
      // Insert
      const newRestaurant = this.restaurantsRepository.create({
        ...createRestaurantDto,
        city: createRestaurantDto.city || 'Bordeaux',
        last_update: new Date(),
      });
      return this.restaurantsRepository.save(newRestaurant);
    }
  }

  /**
   * Supprime un restaurant par ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.restaurantsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
  }
}
