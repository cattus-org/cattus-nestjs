import { CatSex } from 'src/common/interfaces/cats.interfaces';
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
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  birthDate: Date;

  @Column()
  picture: string;

  @Column({
    type: 'enum',
    enum: CatSex,
  })
  sex: CatSex;

  @Column()
  observations: string;

  @Column('text', { array: true })
  vaccines: string[];

  @Column('text', { array: true })
  comorbidities: string[];

  @Column()
  weight: number;

  @Column()
  favorite: boolean;

  @ManyToOne(() => Company, (company) => company.cats)
  company: Company;

  @ManyToOne(() => User, (user) => user.createdAnimals)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedAnimals)
  updatedBy: User;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: false })
  deleted: boolean;
}
