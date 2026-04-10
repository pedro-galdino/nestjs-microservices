import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { ProcessPaymentRequest, RMQ_PATTERNS } from '@shared/contracts';

import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern(RMQ_PATTERNS.payment.process)
  processPayment(@Payload() payload: ProcessPaymentRequest) {
    return this.paymentService.processPayment(payload);
  }
}
