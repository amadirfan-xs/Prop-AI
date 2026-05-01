import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_type_permission' })
export class UserTypePermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userTypeId: number;

  @Column({ type: 'integer' })
  permissionId: number;

  @Column({ type: 'boolean', default: true })
  granted: boolean;

  @Column({ type: 'integer', nullable: true })
  titleCompanyId: number | null;
}
