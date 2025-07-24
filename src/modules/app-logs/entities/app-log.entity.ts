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

  @Column({ nullable: true })
  user: string;

  @Column({ nullable: true })
  companyId: number;

  @Column()
  action: string; //a ação, ex: "UPDATE_USER"

  @Column()
  resource: string; //o modulo, ex: "USERS"

  @Column({ nullable: true })
  details: string;

  @CreateDateColumn()
  createdAt: Date;
}
