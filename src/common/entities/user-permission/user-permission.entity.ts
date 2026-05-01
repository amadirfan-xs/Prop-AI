import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_permission' })
export class UserPermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  permissionId: number;

  @Column({ type: 'boolean', default: true })
  granted: boolean;
}
