import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";

export type Role = "user" | "admin"; // Matches frontend values

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "float", default: 0 })
  balance!: number;

  @Column({ type: "varchar", default: "user" })
  role!: Role;

  @OneToMany(() => Transaction, (t) => t.user)
  transactions!: Transaction[];
}
