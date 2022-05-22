import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'aff_config' })
export class CONFIG {
  @PrimaryColumn({ name: 'name' })
  name: string;

  @Column({ name: 'value' })
  value: string;

  @Column({ type: 'timestamp', default: '() => now()', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: '() => now()', name: 'updated_at' })
  updatedAt: Date;
}
