import { Body, Controller, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProcessPaymentDTO } from './dto/process-payment.dto';
import { PaymentGatewayService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentGatewayService) {}

  @Post('process')
  @ApiOperation({
    summary: 'Trigger payment processing',
    description: 'Sends an asynchronous payment processing command to payment-service.'
  })
  @ApiNoContentResponse({ description: 'Payment processing triggered successfully' })
  process(@Body() body: ProcessPaymentDTO) {
    return this.paymentService.processPayment(body);
  }
}
