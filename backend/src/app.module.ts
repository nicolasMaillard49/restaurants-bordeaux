import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './modules/restaurants.module';
import { ArticlesModule } from './modules/articles.module';
import { Restaurant } from './entities/restaurant.entity';
import { Article } from './entities/article.entity';

@Module({
  imports: [
    // Configuration des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuration TypeORM avec PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres'),
        database: configService.get('DATABASE_NAME', 'restaurants'),
        entities: [Restaurant, Article],
        synchronize: true, // Auto-sync schema (safe for small projects)
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Modules métier
    RestaurantsModule,
    ArticlesModule,
  ],
})
export class AppModule {}
