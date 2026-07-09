export interface IReviewPayload {
  gear_item_id: string;
  rental_order_id: string;
  rating: number;
  comment?: string;
}
