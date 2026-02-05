import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Security: Don't return password in queries by default
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PARTICIPANT,
  })
  role: UserRole;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  profilePicture: string;
}