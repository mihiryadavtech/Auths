import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Basic extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'firstname', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'lastname', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;
}
