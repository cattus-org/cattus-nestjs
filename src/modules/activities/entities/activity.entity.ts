import { ActivityTitle } from 'src/common/constants/activity.constants';
import { Camera } from 'src/modules/cameras/entities/camera.entity';
import { Cat } from 'src/modules/cats/entities/cat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ActivityTitle,
  })
  title: string;

  @ManyToOne(() => Cat, (cat) => cat.activities, { onDelete: 'CASCADE' })
  cat: Cat;

  @ManyToOne(() => Camera, { onDelete: 'SET NULL', nullable: true })
  camera: Camera;

  @Column({ nullable: true })
  cameraId: number;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
