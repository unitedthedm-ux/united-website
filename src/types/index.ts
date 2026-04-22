export interface Listing {
  id: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  down_payment?: number;
  monthly_payment?: number;
  area_sqm: number;
  bedrooms?: number;
  bathrooms?: number;
  unit_type?: string;
  finishing?: string;
  delivery_year?: number;
  compound_name?: string;
  region?: string;
  area?: string;
  neighborhood?: string;
  images: string[];
  show_price: boolean;
  show_downpayment: boolean;
  show_monthly: boolean;
  show_full_price: boolean;
  is_featured: boolean;
  whatsapp_number?: string;
  created_at: string;
}

export interface ResaleUnit {
  id: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  area_sqm: number;
  bedrooms?: number;
  bathrooms?: number;
  unit_type?: string;
  finishing?: string;
  compound_name?: string;
  region?: string;
  area?: string;
  images: string[];
  owner_name?: string;
  show_price: boolean;
  is_featured: boolean;
  whatsapp_number?: string;
  created_at: string;
}

export interface MediaVideo {
  id: string;
  title_en: string;
  title_ar: string;
  platform: "youtube" | "instagram" | "facebook" | "tiktok";
  video_url: string;
  embed_id?: string;
  thumbnail_url?: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  level: number;
  parent_id?: string;
  image_url?: string;
  listing_count?: number;
}
