export interface IRentalOrderPayload {
  startDate: Date;
  endDate: Date;
  items: IRentalOrderItemPayload[];
}

export interface IRentalOrderItemPayload {
  gear_item_id: string;
  quantity: number;
}

export interface IUpdateRentalOrderStatusPayload {
  status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED";
}
