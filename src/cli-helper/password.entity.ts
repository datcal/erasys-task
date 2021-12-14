import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'passwords' })
export class Password {
  @PrimaryColumn()
  password: string;

  @Column({ default: null })
  valid: number;
}
