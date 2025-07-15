import { Cat } from 'src/modules/cats/entities/cat.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'employee' })
  access_level: string;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  //TODO - só falseio tudo ou adiciono ondelete - cascade
  @OneToMany(() => Cat, (cat) => cat.createdBy)
  createdAnimals: Cat[];

  @OneToMany(() => Cat, (cat) => cat.updatedBy)
  updatedAnimals: Cat[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: false })
  deleted: boolean;
}
