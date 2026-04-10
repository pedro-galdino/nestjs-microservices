import { PaymentStatus } from '../enums';

export interface ProcessPaymentRequest {
  orderId: string;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentResultEvent {
  orderId: string;
  paymentId: string;
  status: PaymentStatus;
  failureReason?: string;
}
