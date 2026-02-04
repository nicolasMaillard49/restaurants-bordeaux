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
  ) { }

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
   * Normalise une chaîne pour la comparaison (minuscules, espaces simplifiés)
   */
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Remplace multiples espaces par un seul
      .replace(/[áàâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/ç/g, 'c');
  }

  /**
   * Crée ou met à jour un restaurant (upsert)
   * Priorité de détection des doublons:
   * 1. google_place_id (si fourni)
   * 2. name + address normalisés (fallback)
   */
  async upsert(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const { name, address, google_place_id } = createRestaurantDto;

    let existing: Restaurant | null = null;

    // Priorité 1: Recherche par google_place_id
    if (google_place_id) {
      existing = await this.restaurantsRepository.findOne({
        where: { google_place_id },
      });

      if (existing) {
        // Supprimer l'ancien et créer un nouveau avec les données fraîches
        await this.restaurantsRepository.delete(existing.id);
        const newRestaurant = this.restaurantsRepository.create({
          ...createRestaurantDto,
          city: createRestaurantDto.city || 'Bordeaux',
          last_update: new Date(),
        });
        return this.restaurantsRepository.save(newRestaurant);
      }
    }

    // Priorité 2: Recherche par name + address normalisés
    const normalizedName = this.normalizeString(name);
    const normalizedAddress = this.normalizeString(address);

    const allRestaurants = await this.restaurantsRepository.find();
    existing = allRestaurants.find(
      (r) =>
        this.normalizeString(r.name) === normalizedName &&
        this.normalizeString(r.address) === normalizedAddress,
    ) || null;

    if (existing) {
      // Supprimer l'ancien et créer un nouveau avec les données fraîches
      await this.restaurantsRepository.delete(existing.id);
      const newRestaurant = this.restaurantsRepository.create({
        ...createRestaurantDto,
        city: createRestaurantDto.city || 'Bordeaux',
        last_update: new Date(),
      });
      return this.restaurantsRepository.save(newRestaurant);
    }

    // Insert nouveau restaurant
    const newRestaurant = this.restaurantsRepository.create({
      ...createRestaurantDto,
      city: createRestaurantDto.city || 'Bordeaux',
      last_update: new Date(),
    });
    return this.restaurantsRepository.save(newRestaurant);
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
