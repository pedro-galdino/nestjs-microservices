export const RMQ_CLIENTS = {
  order: 'ORDER_SERVICE',
  payment: 'PAYMENT_SERVICE',
  product: 'PRODUCT_SERVICE'
} as const;

export const RMQ_QUEUES = {
  order: 'order_queue',
  payment: 'payment_queue',
  product: 'product_queue'
} as const;

export const RMQ_PATTERNS = {
  order: {
    create: 'create-order',
    get: 'get-order'
  },
  payment: {
    process: 'process-payment',
    result: 'payment-result'
  },
  product: {
    create: 'create-product',
    get: 'get-product',
    delete: 'delete-product',
    update: 'update-product',
    list: 'list-products',
    reserve: 'reserve-product',
    release: 'release-product'
  }
} as const;
