import { CatSex } from 'src/common/interfaces/cats.interfaces';
import { Activity } from 'src/modules/activities/entities/activity.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { User } from 'src/modules/users/entities/user.entity';
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

  @Column('text', { array: true, nullable: true })
  vaccines: string[];

  @Column('text', { array: true, nullable: true })
  comorbidities: string[];

  @Column({ nullable: true, type: 'numeric' })
  weight: number;

  @Column({ default: false })
  favorite: boolean;

  @ManyToOne(() => Company, (company) => company.cats)
  company: Company;

  @ManyToOne(() => User, (user) => user.createdAnimals)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedAnimals)
  updatedBy: User;

  @OneToMany(() => Activity, (activity) => activity.cat)
  activities: Activity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: null })
  deletedAt: Date;
}
