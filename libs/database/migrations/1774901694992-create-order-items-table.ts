import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemsTable1774901694992 implements MigrationInterface {
  name = 'CreateOrderItemsTable1774901694992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE order_items (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        product_id VARCHAR NOT NULL,
        product_name VARCHAR NOT NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        order_id UUID NOT NULL,
        CONSTRAINT pk_order_items_id PRIMARY KEY (id),
        CONSTRAINT fk_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      DROP TABLE order_items;
    `);
  }
}
