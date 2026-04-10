import { seedProducts } from './products.seed';

async function runSeeds() {
  await seedProducts();
}

runSeeds()
  .then(() => {
    console.log('Seeds finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed execution failed:', error);
    process.exit(1);
  });
