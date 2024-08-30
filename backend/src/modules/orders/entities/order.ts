import { Product } from "@/modules/products/entities/product";

export interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: "pending" | "preparing" | "delivering" | "delivered";
  orderDate: Date;
  paymentMethod:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "apple_pay"
    | "google_pay";
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}
