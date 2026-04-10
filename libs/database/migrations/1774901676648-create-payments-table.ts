import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1774901676648 implements MigrationInterface {
  name = 'CreatePaymentsTable1774901676648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TYPE payments_status_enum AS ENUM ('PENDING', 'APPROVED', 'FAILED', 'REFUNDED');
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE payments (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        order_id VARCHAR NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        status payments_status_enum NOT NULL DEFAULT 'PENDING',
        failure_reason VARCHAR,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_payments_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE INDEX idx_payments_order_id ON payments(order_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      DROP INDEX idx_payments_order_id;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE payments;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TYPE payments_status_enum;
    `);
  }
}
