import { Company } from 'src/modules/companies/entities/company.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Camera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  thumbnail: string;

  @ManyToOne(() => Company, (company) => company.cameras)
  company: Company;

  @ManyToOne(() => User, (user) => user.createdCameras)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: null })
  deletedAt: Date;
}
