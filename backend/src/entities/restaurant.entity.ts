import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('restaurants')
@Index(['name', 'address'], { unique: true }) // Index unique pour détecter les doublons
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  google_place_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) =>
        value === null ? null : Number.parseFloat(value),
    },
  })
  rating: number;

  @Column({ type: 'int', nullable: true })
  rating_count: number;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100, default: 'Bordeaux' })
  city: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  opening_hours: string[];

  @Column({ type: 'int', nullable: true })
  price_level: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  google_maps_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  reservation_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  menu_url: string;

  @Column({ type: 'jsonb', nullable: true })
  types: string[];

  @Column({ type: 'varchar', length: 200, nullable: true })
  cuisine_origin: string;

  @Column({ type: 'jsonb', nullable: true })
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ type: 'varchar', length: 100, default: 'google_maps' })
  source: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
