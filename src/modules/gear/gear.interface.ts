export interface IGearPayload {
  name: string;
  brand?: string;
  description?: string;
  rental_price_per_day: number;
  stock?: number;
  is_available?: boolean;
  image?: string;
  category_id: string;
}
