export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: string;
  items: CreateOrderItem[];
}

export interface GetOrderRequest {
  id: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  orderId: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  amount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
