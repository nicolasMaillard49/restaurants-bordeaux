import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('articles')
@Index(['slug'], { unique: true })
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  image: string;

  @Column({ type: 'timestamp', nullable: true })
  published_date: Date;

  @Column({ type: 'varchar', length: 50, default: 'actualité' })
  category: string;

  @Column({ type: 'jsonb', nullable: true })
  restaurant_names: string[];

  @Column({ type: 'varchar', length: 200, default: 'bougerabordeaux.com' })
  source: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  scraped_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
