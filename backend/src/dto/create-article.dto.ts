import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDateString()
  published_date?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  restaurant_names?: string[];

  @IsOptional()
  @IsString()
  source?: string;
}
