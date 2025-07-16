import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AppLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  companyId: number;

  @Column()
  action: string; //a ação, ex: "UPDATE_USER"

  @Column()
  resource: string; //o modulo, ex: "USERS"

  @CreateDateColumn()
  createdAt: Date;
}
