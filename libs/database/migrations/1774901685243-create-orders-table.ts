import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1774901685243 implements MigrationInterface {
  name = 'CreateOrdersTable1774901685243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TYPE orders_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE orders (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        status orders_status_enum NOT NULL DEFAULT 'PENDING',
        amount NUMERIC(10,2) NOT NULL,
        user_id VARCHAR NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_orders_id PRIMARY KEY (id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      DROP TABLE orders;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TYPE orders_status_enum;
    `);
  }
}
