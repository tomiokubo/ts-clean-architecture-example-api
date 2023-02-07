import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("varchar")
  name?: string;

  @Column("varchar", { length: 100 })
  username?: string;

  @Column("text")
  password_hash?: string;

  @Column("text", { nullable: true })
  access_token?: string;

  @Column("date")
  created_at?: Date;

  @Column("date")
  updated_at?: Date;
}
