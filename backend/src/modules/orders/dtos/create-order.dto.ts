export interface CreateOrderDTO {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CreateOrderItemDTO[];
  paymentMethod:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "apple_pay"
    | "google_pay";
}

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
}
