import { Injectable } from '@nestjs/common';

import { ProcessPaymentRequest } from '@shared/contracts';

import { ProcessPaymentUseCase } from './use-cases/process-payment.use-case';

@Injectable()
export class PaymentService {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  async processPayment(payload: ProcessPaymentRequest): Promise<void> {
    return this.processPaymentUseCase.execute(payload);
  }
}
