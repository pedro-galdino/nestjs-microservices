import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { RMQ_CLIENTS, RMQ_PATTERNS } from '@shared/contracts';

import { ProcessPaymentDTO } from './dto/process-payment.dto';

@Injectable()
export class PaymentGatewayService {
  constructor(
    @Inject(RMQ_CLIENTS.payment)
    private readonly paymentClient: ClientProxy
  ) {}

  processPayment(payload: ProcessPaymentDTO) {
    this.paymentClient.emit(RMQ_PATTERNS.payment.process, payload);
  }
}
