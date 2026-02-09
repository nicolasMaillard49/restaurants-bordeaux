import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find({
      order: { published_date: 'DESC' },
      take: 20,
    });
  }

  async upsert(dto: CreateArticleDto): Promise<{ article: Article; action: 'created' | 'updated' }> {
    const existing = await this.articlesRepository.findOne({
      where: { slug: dto.slug },
    });

    if (existing) {
      await this.articlesRepository.update(existing.id, {
        title: dto.title,
        url: dto.url,
        excerpt: dto.excerpt,
        image: dto.image,
        published_date: dto.published_date ? new Date(dto.published_date) : existing.published_date,
        category: dto.category || existing.category,
        restaurant_names: dto.restaurant_names,
        scraped_at: new Date(),
      });
      const updated = await this.articlesRepository.findOne({ where: { id: existing.id } });
      return { article: updated, action: 'updated' };
    }

    const article = this.articlesRepository.create({
      ...dto,
      published_date: dto.published_date ? new Date(dto.published_date) : null,
      scraped_at: new Date(),
    });
    const saved = await this.articlesRepository.save(article);
    return { article: saved, action: 'created' };
  }
}
