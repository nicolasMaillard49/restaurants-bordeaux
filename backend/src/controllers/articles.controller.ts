import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll() {
    return this.articlesService.findAll();
  }

  @Post('import')
  @UseGuards(ApiKeyGuard)
  async importArticles(@Body() body: { articles: CreateArticleDto[] }) {
    const results = [];
    for (const articleDto of body.articles) {
      const result = await this.articlesService.upsert(articleDto);
      results.push(result);
    }
    return {
      success: true,
      imported: results.length,
      created: results.filter(r => r.action === 'created').length,
      updated: results.filter(r => r.action === 'updated').length,
    };
  }
}
