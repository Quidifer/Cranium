import { Migration } from '@mikro-orm/migrations';

export class Migration20230220054625 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_session" ("id" varchar(255) not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "username" varchar(255) not null, constraint "user_session_pkey" primary key ("id"));');
  }

}
