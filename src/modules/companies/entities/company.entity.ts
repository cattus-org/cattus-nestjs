import { Camera } from 'src/modules/cameras/entities/camera.entity';
import { Cat } from 'src/modules/cats/entities/cat.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cnpj: string;

  @Column()
  logotype: string;

  @Column()
  phone: string;

  @OneToOne(() => User)
  @JoinColumn()
  responsible: User;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Cat, (cat) => cat.company)
  cats: Cat[];

  @OneToMany(() => Camera, (camera) => camera.company)
  cameras: Camera[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: null })
  deletedAt: Date;
}
