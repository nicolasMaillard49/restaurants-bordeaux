import { IsString, IsNumber, IsArray, IsOptional, IsUrl, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ReviewDto {
  @IsString()
  author: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  text: string;

  @IsString()
  date: string;
}

export class CreateRestaurantDto {
  @IsString()
  @IsOptional()
  google_place_id?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  rating_count?: number;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  opening_hours?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(4)
  price_level?: number;

  @IsUrl()
  @IsOptional()
  google_maps_url?: string;

  @IsUrl()
  @IsOptional()
  reservation_url?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  types?: string[];

  @IsString()
  @IsOptional()
  cuisine_origin?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews?: ReviewDto[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsString()
  @IsOptional()
  source?: string;
}
