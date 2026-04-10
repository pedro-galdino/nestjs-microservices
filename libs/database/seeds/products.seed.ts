import { ProductEntity } from 'apps/product-service/src/product/entities/product.entity';

import { dataSource } from '../datasource';

export async function seedProducts() {
  try {
    await dataSource.initialize();
    const productRepository = dataSource.getRepository(ProductEntity);

    const existingProducts = await productRepository.count();
    if (existingProducts > 0) return;

    const productsData = [
      { name: 'Laptop Dell XPS 13', price: 1200, description: 'High-performance laptop', available: 100 },
      { name: 'iPhone 15 Pro', price: 999, description: 'Latest iPhone model', available: 100 },
      { name: 'Samsung Galaxy S24', price: 899, description: 'Flagship Android phone', available: 100 },
      { name: 'iPad Air', price: 599, description: 'Apple tablet', available: 100 },
      { name: 'LG OLED TV 55"', price: 1499, description: '4K OLED Smart TV', available: 100 },
      { name: 'PlayStation 5', price: 499, description: 'Gaming console', available: 100 }
    ];

    const products = productRepository.create(productsData);
    await productRepository.save(products);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Seed script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}
