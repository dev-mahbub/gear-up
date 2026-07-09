export interface IRentalOrderItemPayload {
  gear_item_id: string;
  quantity: number;
}

export interface IRentalOrderPayload {
  startDate: Date;
  endDate: Date;
  items: IRentalOrderItemPayload[];
}
